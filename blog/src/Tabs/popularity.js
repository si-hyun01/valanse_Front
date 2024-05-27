import React, { useState, useEffect } from "react";
import axios from 'axios';

const Popularity = () => {
    const [quizData, setQuizData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('https://valanse.site/quiz/sort-by-preference');
            setQuizData(response.data);
        } catch (error) {
            console.error('Error fetching quiz data:', error.message);
        }
    };

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
                                        <p>{item.descriptionA}</p>
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
