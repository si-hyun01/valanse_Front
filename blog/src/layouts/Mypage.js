import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Container, Typography, Button, TextField, Card, CardContent } from '@mui/material';
import Header from './Header';
import './myPage.css'; // 추가 스타일링을 위한 CSS 파일

const QuizDetail = ({ quiz, onDelete, onGoBack, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [updatedContent, setUpdatedContent] = useState(quiz.content);

    const handleUpdate = () => {
        onUpdate(quiz.quizId, updatedContent);
        setIsEditing(false);
    };

    return (
        <Card className="quiz-detail" sx={{ bgcolor: 'black', borderRadius: '16px', p: 2 }}>
            <CardContent>
                {isEditing ? (
                    <>
                        <TextField
                            label="Content"
                            value={updatedContent}
                            onChange={(e) => setUpdatedContent(e.target.value)}
                            fullWidth
                            margin="normal"
                            sx={{ input: { color: 'white' }, label: { color: 'white' } }}
                        />
                        <Button onClick={handleUpdate} color="primary" sx={{ borderColor: 'lime', color: 'lime' }}>확인</Button>
                        <Button onClick={() => setIsEditing(false)} color="secondary" sx={{ borderColor: 'red', color: 'red' }}>취소</Button>
                    </>
                ) : (
                    <>
                        <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>{quiz.content}</Typography>
                        <Typography variant="subtitle2" sx={{ color: 'white' }}>퀴즈 ID: {quiz.quizId}</Typography>
                        {quiz.imageA && <img src={quiz.imageA} alt="Option A" style={{ width: '100%', height: '250px', objectFit: 'cover', marginBottom: '8px' }} />}
                        <Typography sx={{ color: 'white' }}>{quiz.descriptionA}</Typography>
                        {quiz.imageB && <img src={quiz.imageB} alt="Option B" style={{ width: '100%', height: '250px', objectFit: 'cover', marginBottom: '8px' }} />}
                        <Typography sx={{ color: 'white' }}>{quiz.descriptionB}</Typography>
                        <Button onClick={onGoBack} color="primary" sx={{ borderColor: 'lime', color: 'lime' }}>뒤로가기</Button>
                        <Button onClick={() => onDelete(quiz.quizId)} color="error" sx={{ borderColor: 'red', color: 'red' }}>삭제하기</Button>
                        <Button onClick={() => setIsEditing(true)} color="primary" sx={{ borderColor: 'lime', color: 'lime' }}>수정하기</Button>
                    </>
                )}
            </CardContent>
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
                            <td className="title-cell">{quiz.content}</td> {/* 제목 열에 클래스 추가 */}
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

    const handleQuizClick = (quiz) => {
        setSelectedQuiz(quiz);
        setShowDetail(true);
    };

    const handleDeleteQuiz = async (quizId) => {
        try {
            await axios.delete(`https://valanse.site/quiz/${quizId}`);
            setQuizzes(quizzes.filter(quiz => quiz.quizId !== quizId));
            setSelectedQuiz(null);
            setShowDetail(false);
        } catch (error) {
            console.error('Error deleting quiz:', error);
        }
    };

    const handleUpdateQuiz = async (quizId, content) => {
        try {
            await axios.patch(`https://valanse.site/quiz/${quizId}`, {
                quizRegisterDto: {
                    content,
                    optionA: selectedQuiz.optionA,
                    optionB: selectedQuiz.optionB,
                    descriptionA: selectedQuiz.descriptionA,
                    descriptionB: selectedQuiz.descriptionB,
                    category: selectedQuiz.category
                },
                image_A: selectedQuiz.imageA,
                image_B: selectedQuiz.imageB
            });
            setQuizzes(quizzes.map(quiz => (quiz.quizId === quizId ? { ...quiz, content } : quiz)));
            setSelectedQuiz({ ...selectedQuiz, content });
        } catch (error) {
            console.error('Error updating quiz:', error);
        }
    };

    const handleGoBack = () => {
        setShowDetail(false);
        setSelectedQuiz(null);
    };

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await axios.get('https://valanse.site/quiz/user');
                setQuizzes(response.data.data);
            } catch (error) {
                console.error('Error fetching quizzes:', error);
            }
        };

        fetchQuizzes();
    }, []);

    return (
        <div>
            <Header />
            <Container className="quiz-container" style={{ marginTop: '50px', maxWidth: "80%" }}>
                <Typography variant="h4" className="quiz-title" style={{ fontWeight: 'bold', color: 'white', marginBottom: '10px', textAlign: 'center', fontSize: '2.5rem' }}>
                    마이 페이지
                </Typography>
                {!showDetail ? (
                    <>
                        <QuizList quizzes={quizzes} onItemClick={handleQuizClick} />
                    </>
                ) : (
                    <QuizDetail
                        quiz={selectedQuiz}
                        onDelete={handleDeleteQuiz}
                        onGoBack={handleGoBack}
                        onUpdate={handleUpdateQuiz}
                    />
                )}
            </Container>
        </div>
    );
};

export default MyPage;
