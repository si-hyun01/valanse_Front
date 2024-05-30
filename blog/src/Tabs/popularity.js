import React, { useState, useEffect } from "react";
import axios from 'axios';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const Popularity = () => {
    const [quizData, setQuizData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // 페이지당 보여줄 퀴즈 수

    useEffect(() => {
        fetchData();
    }, [currentPage]); // 현재 페이지가 변경될 때마다 데이터 다시 가져오기

    const fetchData = async () => {
        try {
            const response = await axios.get(`https://valanse.site/quiz/sort-by-preference?page=${currentPage}&limit=${itemsPerPage}`);
            const sortedQuizData = response.data.data;
            const updatedQuizData = await Promise.all(sortedQuizData.map(async (item) => {
                const likeStatsResponse = await axios.get(`https://valanse.site/quiz/${item.quizId}/like-stats`);
                return {
                    ...item,
                    likes: likeStatsResponse.data.data.likeCount,
                    dislikes: likeStatsResponse.data.data.unlikeCount
                };
            }));
            setQuizData(updatedQuizData);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching quiz data:', error.message);
            setError('Error fetching quiz data. Please try again later.');
            setIsLoading(false);
        }
    };

    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
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

    return (
        <div>
            <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ width: '50px', textAlign: 'center', border: '1px solid #dee2e6', color: 'white', fontWeight: 'bold' }}>퀴즈ID</th>
                            <th style={{ width: '400px', textAlign: 'center', border: '1px solid #dee2e6', color: 'white', fontWeight: 'bold' }}>제목</th>
                            <th style={{ width: '100px', textAlign: 'center', border: '1px solid #dee2e6', color: 'white', fontWeight: 'bold' }}>좋아요</th>
                            <th style={{ width: '100px', textAlign: 'center', border: '1px solid #dee2e6', color: 'white', fontWeight: 'bold' }}>싫어요</th>
                        </tr>
                    </thead>
                    <tbody>
                        {quizData.map((item) => (
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
                                <td style={{ textAlign: 'center', border: '1px solid #dee2e6', color: 'white', fontWeight: 'bold' }}>{item.likes}</td>
                                <td style={{ textAlign: 'center', border: '1px solid #dee2e6', color: 'white', fontWeight: 'bold' }}>{item.dislikes}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <Stack spacing={2} style={{ justifyContent: 'center', marginTop: '20px' }}>
                <Pagination count={Math.ceil(totalCount / itemsPerPage)} page={currentPage} onChange={handlePageChange} />
            </Stack>
        </div>
    );
}

export default Popularity;
