import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Container, Typography, Button, TextField, Card, CardContent, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import Header from './Header';
import '../../src/layouts/Mypage.css'; 
import Bground from "../layouts/img/green_hexa.png";

const QuizDetail = ({ quiz, onDelete, onGoBack, onUpdate }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [updatedContent, setUpdatedContent] = useState(quiz.content);
    const [openDialog, setOpenDialog] = useState(false);

    const handleUpdate = () => {
        onUpdate(quiz.quizId, updatedContent);
        setIsEditing(false);
    };

    const handleDeleteConfirmation = () => {
        setOpenDialog(true);
    };

    const handleDelete = async () => {
        await onDelete(quiz.quizId);
        setOpenDialog(false);
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
                        <Button onClick={handleDeleteConfirmation} color="error" sx={{ borderColor: 'red', color: 'red' }}>삭제하기</Button>
                        <Button onClick={() => setIsEditing(true)} color="primary" sx={{ borderColor: 'lime', color: 'lime' }}>수정하기</Button>
                    </>
                )}
            </CardContent>
            <Dialog
                open={openDialog}
                onClose={() => setOpenDialog(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"퀴즈 삭제"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        퀴즈를 삭제하시겠습니까? 삭제한 퀴즈는 복구할 수 없습니다.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)} color="primary">
                        취소
                    </Button>
                    <Button onClick={handleDelete} color="error" autoFocus>
                        삭제
                    </Button>
                </DialogActions>
            </Dialog>
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
        <div style={{ backgroundImage: `url(${Bground})`, backgroundSize: 'cover', minHeight: '100vh' }}>
            <Container className="quiz-container" style={{ marginTop: '50px', maxWidth: "80%", backgroundColor: 'rgba(0,0,0,0.7)', padding: '20px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.5)' }}>
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

