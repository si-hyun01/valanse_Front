import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Card, CardContent, CardMedia, CardActions, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Grid } from '@mui/material';
import Header from './Header';
import EditQuestionDialog from './remake_problem';

const MyPage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [updatedContent, setUpdatedContent] = useState("");

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

    const handleDelete = async (quizId) => {
        try {
            await axios.delete(`https://valanse.site/quiz/${quizId}`);
            setQuizzes(quizzes.filter(quiz => quiz.quizId !== quizId));
        } catch (error) {
            console.error('Error deleting quiz:', error);
        }
    };

    const handleEdit = (quiz) => {
        setSelectedQuiz(quiz);
        setOpenDialog(true);
    };

    const handleUpdate = async () => {
        try {
            await axios.patch(`https://valanse.site/quiz/${selectedQuiz.quizId}`, {
                quizRegisterDto: {
                    content: updatedContent,
                    optionA: selectedQuiz.optionA,
                    optionB: selectedQuiz.optionB,
                    descriptionA: selectedQuiz.descriptionA,
                    descriptionB: selectedQuiz.descriptionB,
                    category: selectedQuiz.category
                },
                image_A: selectedQuiz.imageA,
                image_B: selectedQuiz.imageB
            });
            setOpenDialog(false);
            // Update quizzes state to reflect changes
            setQuizzes(quizzes.map(quiz => quiz.quizId === selectedQuiz.quizId ? { ...quiz, content: updatedContent } : quiz));
            // Reset updated content
            setUpdatedContent("");
        } catch (error) {
            console.error('Error updating quiz:', error);
        }
    };

    return (
        <>
            <Header />
            <div>
                <Typography variant="h4" gutterBottom>
                    마이 페이지 개발 중입니다.....
                </Typography>
                <Grid container spacing={2}>
                    {quizzes.map((quiz) => (
                        <Grid item xs={12} sm={6} md={4} key={quiz.quizId}>
                            <Card>
                                {quiz.imageA && (
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={quiz.imageA}
                                        alt="Option A"
                                    />
                                )}
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        {quiz.content}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {quiz.descriptionA}
                                    </Typography>
                                    {quiz.imageB && (
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={quiz.imageB}
                                            alt="Option B"
                                            style={{ marginTop: '16px' }}
                                        />
                                    )}
                                    <Typography variant="body2" color="text.secondary">
                                        {quiz.descriptionB}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        선호도: {quiz.preference} 조회수: {quiz.view}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleEdit(quiz)}
                                        style={{ marginRight: '8px' }}
                                    >
                                        수정하기
                                    </Button>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        onClick={() => handleDelete(quiz.quizId)}
                                    >
                                        삭제하기
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </div>
            {/* 수정 다이얼로그 */}
            <EditQuestionDialog
                open={openDialog}
                handleClose={() => setOpenDialog(false)}
                quiz={selectedQuiz}
                handleEdit={handleUpdate}
            />
        </>
    );
};

export default MyPage;
