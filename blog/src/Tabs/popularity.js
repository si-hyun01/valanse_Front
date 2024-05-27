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
            setQuizData(response.data.data); // 변경된 부분: response.data.data로 변경
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
        <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                    {quizData.map((item) => (
                        <tr key={item.quizId}>
                            <td style={{ width: '50px', verticalAlign: 'middle', textAlign: 'center', border: '1px solid #dee2e6' }}>{item.quizId}</td>
                            <td style={{ width: '400px', border: '1px solid #dee2e6', borderRight: 'none' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    <img src={item.imageA} alt="Option A" style={{ marginRight: '10px', width: '150px', height: 'auto' }} />
                                    <div>
                                        <h5>{item.content}</h5>
                                    </div>
                                </div>
                            </td>
                            <td style={{ width: '200px', verticalAlign: 'bottom', textAlign: 'right', border: '1px solid #dee2e6', borderLeft: 'none', paddingTop: '20px' }}>
                                <div style={{ minWidth: '100px' }}>
                                    <div style={{ fontSize: '12px', marginRight: '10px' }}>Likes: {item.preference}</div>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Popularity;
