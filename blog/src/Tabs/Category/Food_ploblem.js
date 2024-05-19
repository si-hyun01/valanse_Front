import React, { useState, useEffect } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';

const QuizPage = () => {
    const [quizData, setQuizData] = useState(null);

    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                const response = await axios.get('https://valanse.site/quiz/1', {
                    headers: {
                        'accept': 'application/json',
                        'Authorization': Cookies.get('access_token')
                    }
                });
                setQuizData(response.data);
            } catch (error) {
                console.error('Error fetching quiz data:', error.message);
            }
        };

        fetchQuizData();
    }, []);

    if (!quizData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {/* 여기에 퀴즈 데이터를 표시하는 코드 작성 */}
            <h2>{quizData.title}</h2>
            <ul>
                {quizData.questions.map((question, index) => (
                    <li key={index}>
                        <h3>{question.text}</h3>
                        <ul>
                            {question.options.map((option, optionIndex) => (
                                <li key={optionIndex}>{option}</li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default QuizPage;
