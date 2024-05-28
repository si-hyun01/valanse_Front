import React, { useState, useEffect } from "react";
import axios from 'axios';

const Popularity = () => {
    const [quizData, setQuizData] = useState([{}, {}, {}]); // 초기 상태를 3개의 빈 객체로 설정

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('https://valanse.site/quiz/sort-by-preference');
            setQuizData(response.data.data.slice(0, 3)); // 상위 3개 퀴즈만 설정
        } catch (error) {
            console.error('Error fetching quiz data:', error.message);
        }
    };
    
    return (
        <div style={{ marginTop: '20px', color: 'white' }}>
            <h2 style={{ marginBottom: '10px', color: 'white', fontWeight: 'bold'}}>인기 퀴즈</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                {quizData.map((item, index) => (
                    <div key={index} style={{ width: 'calc(33.33% - 20px)', margin: '10px', border: '1px solid #ccc', borderRadius: '5px', padding: '10px', overflow: 'hidden' }}>
                        {item.imageA ? (
                            <img src={item.imageA} alt="Option A" style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ width: '100%', height: '250px', backgroundColor: '#ddd' }}></div>
                        )}
                        <h3 style={{ marginTop: '10px', marginBottom: '5px', color: 'white' }}>{item.content || '로그인 하세요'}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Popularity;
