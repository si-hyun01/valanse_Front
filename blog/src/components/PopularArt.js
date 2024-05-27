import React, { useState, useEffect } from "react";
import axios from 'axios';

const Popularity = () => {
    const [quizData, setQuizData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('https://valanse.site/quiz/sort-by-preference');
            setQuizData(response.data.data.slice(0, 3)); // 상위 3개 퀴즈만 설정
            setIsLoading(false);
        } catch (error) {
            console.error('Error fetching quiz data:', error.message);
            setError('Error fetching quiz data. Please try again later.');
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (quizData.length === 0) {
        return <div>No quiz data available.</div>;
    }

    return (
        <div style={{ marginTop: '20px', color: 'white' }}>
            <h2 style={{ marginBottom: '10px', color: 'white' }}>인기 퀴즈</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {quizData.map((item, index) => (
                    <div key={index} style={{ width: 'calc(33.33% - 20px)', margin: '10px', border: '1px solid #ccc', borderRadius: '5px', padding: '10px', overflow: 'hidden' }}>
                        <img src={item.imageA} alt="Option A" style={{ width: '100%', height: 'auto', objectFit: 'cover', maxHeight: '300px' }} />
                        <h3 style={{ marginTop: '10px', marginBottom: '5px', color: 'white' }}>{item.content}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Popularity;
