import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Container, Typography, Button, Card, CardContent } from '@mui/material';
import Bground from "../layouts/img/green_hexa.png";
import CreateQuestionDialog from '../layouts/remake_problem'; 

const QuizDetail = ({ quiz, onDelete, onGoBack }) => {
    const [openDialog, setOpenDialog] = useState(false);

    const handleDeleteConfirmation = () => {
        setOpenDialog(true); 
    };

    return (
        <Card className="quiz-detail" sx={{ bgcolor: 'black', borderRadius: '16px', p: 2 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>{quiz.content}</Typography>
                <Typography variant="subtitle2" sx={{ color: 'white' }}>퀴즈 ID: {quiz.quizId}</Typography>
                <Button onClick={onGoBack} color="primary" sx={{ borderColor: 'lime', color: 'lime', marginRight: '10px' }}>뒤로가기</Button>
                <Button onClick={handleDeleteConfirmation} color="error" sx={{ borderColor: 'red', color: 'red', marginRight: '10px' }}>삭제하기</Button>
                <Button onClick={() => setOpenDialog(true)} color="primary" sx={{ borderColor: 'lime', color: 'lime' }}>수정하기</Button>
            </CardContent>
            <CreateQuestionDialog
                open={openDialog}
                handleClose={() => setOpenDialog(false)} 
                quiz={quiz}
                handleCreate={onDelete}
            />
        </Card>
    );
};

const QuizList = ({ quizzes, onItemClick }) => {
    return (
        <div className="quiz-list" style={{ fontWeight: 'bold', color: 'white' }}>
            <table>
                <thead>
                    <tr>
                        <th>제목</th>
                    </tr>
                </thead>
                <tbody>
                    {quizzes.map((quiz) => (
                        <tr key={quiz.quizId} onClick={() => onItemClick(quiz)}>
                            <td className="title-cell">{quiz.content}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const MyPage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [showDetail, setShowDetail] = useState(false);

    const fetchQuizzes = async () => {
        try {
            const response = await axios.get('https://valanse.site/quiz/user');
            setQuizzes(response.data.data);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, []);

    const handleQuizClick = (quiz) => {
        setSelectedQuiz(quiz);
        setShowDetail(true);
    };

    const handleDeleteQuiz = async () => {
        try {
            if (!selectedQuiz) return;
            await axios.delete(`https://valanse.site/quiz/${selectedQuiz.quizId}`);
            setQuizzes(quizzes.filter((quiz) => quiz.quizId !== selectedQuiz.quizId));
            setSelectedQuiz(null);
            setShowDetail(false);
        } catch (error) {
            console.error('Error deleting quiz:', error);
        }
    };

    const handleGoBack = () => {
        setShowDetail(false);
        setSelectedQuiz(null);
    };

    return (
        <div style={{ backgroundImage: `url(${Bground})`, backgroundSize: 'cover', minHeight: '100vh' }}>
            <Container className="quiz-container" style={{ marginTop: '50px', maxWidth: "80%", backgroundColor: 'rgba(0,0,0,0.7)', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.5)' }}>
                <Typography variant="h4" className="quiz-title" style={{ fontWeight: 'bold', color: 'white', marginBottom: '10px', textAlign: 'center', fontSize: '2.5rem' }}>
                    마이 페이지
                </Typography>
                {!showDetail ? (
                    <QuizList quizzes={quizzes} onItemClick={handleQuizClick} />
                ) : (
                    <QuizDetail
                        quiz={selectedQuiz}
                        onDelete={handleDeleteQuiz}
                        onGoBack={handleGoBack}
                    />
                )}
            </Container>
        </div>
    );
};

export default MyPage;
