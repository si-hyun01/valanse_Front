import React, { useState, useEffect } from "react";
import axios from 'axios';
import Pagination from '@mui/material/Pagination';

const Popularity = () => {
    const [quizData, setQuizData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const itemsPerPage = 5;

    useEffect(() => {
        fetchData();
    }, [page]);

    const fetchData = async () => {
        try {
            const response = await axios.get('https://valanse.site/quiz/sort-by-preference');
            setQuizData(response.data.data);
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching quiz data:', error.message);
            setError('Error fetching quiz data. Please try again later.');
            setIsLoading(false);
        }
    };

    const handlePageChange = (event, value) => {
        setPage(value);
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
        <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ width: '50px', textAlign: 'center', border: '1px solid #dee2e6', color: 'white', fontWeight: 'bold' }}>퀴즈ID</th>
                        <th style={{ width: '400px', textAlign: 'center', border: '1px solid #dee2e6', color: 'white', fontWeight: 'bold' }}>제목</th>
                        <th style={{ width: '200px', textAlign: 'center', border: '1px solid #dee2e6', color: 'white', fontWeight: 'bold' }}>선호도</th>
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
                                <div style={{ fontSize: '12px', color: 'white', fontWeight: 'bold' }}>선호도: {item.preference}</div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Pagination count={Math.ceil(quizData.length / itemsPerPage)} page={page} onChange={handlePageChange} variant="outlined" shape="rounded" />
        </div>
    );
}

export default Popularity;
