import React, { useState, useEffect } from "react";
import axios from 'axios';
import Pagination from '@mui/material/Pagination';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

const Popularity = () => {
    const [quizData, setQuizData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [anchorEl, setAnchorEl] = useState(null);
    const [sortOrder, setSortOrder] = useState('desc'); // Default sort order
    const itemsPerPage = 5;

    useEffect(() => {
        fetchData();
    }, [page, sortOrder]);

    const fetchData = async () => {
        try {
            const response = await axios.get('https://valanse.site/quiz/sort-by-preference');
            const quizIds = response.data.data.map(quiz => quiz.quizId);
            const likeStatsResponses = await Promise.all(quizIds.map(quizId => axios.get(`https://valanse.site/quiz/${quizId}/like-stats`)));
            const quizDataWithLikesAndDislikes = response.data.data.map((quiz, index) => ({
                ...quiz,
                likes: likeStatsResponses[index].data.data.likeCount,
                dislikes: likeStatsResponses[index].data.data.unlikeCount
            }));

            // 정렬하기
            const sortedData = [...quizDataWithLikesAndDislikes].sort((a, b) => {
                if (sortOrder === 'asc') {
                    return a.likes - b.likes;
                } else {
                    return b.likes - a.likes;
                }
            });

            setQuizData(sortedData);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching quiz data:', error.message);
            setError('로그인을 해야 볼 수 있습니다.');
            setIsLoading(false);
        }
    };

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleSortOrderChange = (order) => {
        setSortOrder(order);
        handleMenuClose();
    };

    if (isLoading) {
        return <div style={{ color: 'white', fontWeight: 'bold' }}>Loading...</div>;
    }

    if (error) {
        return <div style={{ color: 'white', fontWeight: 'bold' }}>Error: {error}</div>;
    }

    if (quizData.length === 0) {
        return <div style={{ color: 'white', fontWeight: 'bold' }}>No quiz data available.</div>;
    }

    // 현재 페이지에 맞는 퀴즈 데이터만 선택
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentPageData = quizData.slice(startIndex, endIndex);

    return (
        <div style={{ overflowX: 'auto', maxWidth: '100%', textAlign: 'center' }}>
            <Button
                variant="contained"
                onClick={handleMenuClick}
                style={{ marginBottom: '20px' }}
            >
                정렬 옵션
            </Button>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => handleSortOrderChange('asc')}>오름차순</MenuItem>
                <MenuItem onClick={() => handleSortOrderChange('desc')}>내림차순</MenuItem>
            </Menu>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ width: '50px', textAlign: 'center', border: '1px solid #dee2e6', color: 'white', fontWeight: 'bold' }}>퀴즈ID</th>
                        <th style={{ width: '400px', textAlign: 'center', border: '1px solid #dee2e6', color: 'white', fontWeight: 'bold' }}>제목</th>
                        <th style={{ width: '200px', textAlign: 'center', border: '1px solid #dee2e6', color: 'white', fontWeight: 'bold' }}>좋아요</th>
                        <th style={{ width: '200px', textAlign: 'center', border: '1px solid #dee2e6', color: 'white', fontWeight: 'bold' }}>싫어요</th>
                    </tr>
                </thead>
                <tbody>
                    {currentPageData.map((item) => (
                        <tr key={item.quizId}>
                            <td style={{ textAlign: 'center', border: '1px solid #dee2e6', color: 'white', fontWeight: 'bold' }}>{item.quizId}</td>
                            <td style={{ border: '1px solid #dee2e6', color: 'white', fontWeight: 'bold', padding: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <img src={item.imageA} alt="Option A" style={{ marginRight: '10px', width: '150px', height: '150px', objectFit: 'cover' }} />
                                    <div>
                                        <h5 style={{ color: 'white', fontWeight: 'bold' }}>{item.content}</h5>
                                    </div>
                                </div>
                            </td>
                            <td style={{ textAlign: 'center', border: '1px solid #dee2e6', color: 'white', fontWeight: 'bold' }}>
                                <div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{item.likes}</div>
                            </td>
                            <td style={{ textAlign: 'center', border: '1px solid #dee2e6', color: 'white', fontWeight: 'bold' }}>
                                <div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{item.dislikes}</div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                <Pagination
                    count={Math.ceil(quizData.length / itemsPerPage)}
                    page={page}
                    onChange={handlePageChange}
                    variant="outlined"
                    shape="rounded"
                    sx={{
                        '& .MuiPaginationItem-root': { color: 'white' }, // 버튼 색상 수정
                        '& .MuiPaginationItem-sizeLarge': { fontSize: '2.5rem' }, // 페이지 버튼 크기를 크기 설정
                        '& .MuiPaginationItem-outlined': { backgroundColor: '#00FF00' }, // 야광 초록색 배경 설정
                    }}
                />
            </div>
        </div>
    );
}

export default Popularity;
