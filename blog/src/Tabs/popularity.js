import React, { useState, useEffect } from "react";
import axios from 'axios';
import Pagination from '@mui/material/Pagination';
import Button from '@mui/material/Button';

const Popularity = () => {
    const [quizData, setQuizData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [sortOrder, setSortOrder] = useState('desc'); 
    const itemsPerPage = 5;

    useEffect(() => {
        fetchData();
    }, [page, sortOrder]);

    const fetchData = async () => {
        try {
            const response = await axios.get('https://valanse.site/quiz/sort-by-preference');
            let quizData = response.data.data;

            // 정렬하기
            const sortedData = [...quizData].sort((a, b) => {
                if (sortOrder === 'asc') {
                    return a.preference - b.preference;
                } else {
                    return b.preference - a.preference;
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

    const handleSortOrderChange = (order) => {
        setSortOrder(order);
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
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px', marginTop: '10px' }}>
                <Button
                    variant="text"
                    onClick={() => handleSortOrderChange('asc')}
                    style={{
                        marginRight: '10px',
                        color: sortOrder === 'asc' ? '#00FF00' : 'white',
                        borderBottom: sortOrder === 'asc' ? '2px solid #00FF00' : 'none',
                    }}
                >
                    오름차순
                </Button>
                <Button
                    variant="text"
                    onClick={() => handleSortOrderChange('desc')}
                    style={{
                        color: sortOrder === 'desc' ? '#00FF00' : 'white',
                        borderBottom: sortOrder === 'desc' ? '2px solid #00FF00' : 'none',
                    }}
                >
                    내림차순
                </Button>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ width: '50px', textAlign: 'center', border: '1px solid #dee2e6', color: 'white', fontWeight: 'bold' }}>순위</th>
                        <th style={{ width: '400px', textAlign: 'center', border: '1px solid #dee2e6', color: 'white', fontWeight: 'bold' }}>제목</th>
                        <th style={{ width: '200px', textAlign: 'center', border: '1px solid #dee2e6', color: 'white', fontWeight: 'bold' }}>선호도</th>
                        <th style={{ width: '200px', textAlign: 'center', border: '1px solid #dee2e6', color: 'white', fontWeight: 'bold' }}>조회수</th>
                    </tr>
                </thead>
                <tbody>
                    {currentPageData.map((item, index) => (
                        <tr key={item.quizId}>
                            <td style={{ textAlign: 'center', border: '1px solid #dee2e6', color: 'white', fontWeight: 'bold' }}>
                                {startIndex + index + 1}
                            </td>
                            <td style={{ border: '1px solid #dee2e6', color: 'white', fontWeight: 'bold', padding: '10px' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <img src={item.imageA} alt="Option A" style={{ marginRight: '10px', width: '150px', height: '150px', objectFit: 'cover' }} />
                                    <div>
                                        <h5 style={{ color: 'white', fontWeight: 'bold' }}>{item.content}</h5>
                                    </div>
                                </div>
                            </td>
                            <td style={{ textAlign: 'center', border: '1px solid #dee2e6', color: 'white', fontWeight: 'bold' }}>
                                <div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{item.preference}</div>
                            </td>
                            <td style={{ textAlign: 'center', border: '1px solid #dee2e6', color: 'white', fontWeight: 'bold' }}>
                                <div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>{item.viewCount}</div>
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
                        '& .MuiPaginationItem-root': { color: 'white' },
                        '& .MuiPaginationItem-sizeLarge': { fontSize: '2.5rem' },
                        '& .MuiPaginationItem-outlined': { backgroundColor: '#00FF00' },
                    }}
                />
            </div>
        </div>
    );
}

export default Popularity;
