import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Card, CardContent, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
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
            setQuizzes(quizzes.map(quiz => quiz.quizId === selectedQuiz.quizId ? { ...quiz, content: updatedContent } : quiz));
            setUpdatedContent("");
        } catch (error) {
            console.error('Error updating quiz:', error);
        }
    };

    return (
        <>
            <Header />
            <Card style={{ margin: '20px', padding: '20px' }}>
                <CardContent>
                    <Typography variant="h4" gutterBottom>
                        마이 페이지 개발 중입니다.....
                    </Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>제목</TableCell>
                                    <TableCell>왼쪽 사진</TableCell>
                                    <TableCell>왼쪽 설명</TableCell>
                                    <TableCell>오른쪽 사진</TableCell>
                                    <TableCell>오른쪽 설명</TableCell>
                                    <TableCell>선호도</TableCell>
                                    <TableCell>조회수</TableCell>
                                    <TableCell>작업</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {quizzes.map((quiz) => (
                                    <TableRow key={quiz.quizId}>
                                        <TableCell>{quiz.content}</TableCell>
                                        <TableCell>
                                            {quiz.imageA && (
                                                <img src={quiz.imageA} alt="Option A" style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
                                            )}
                                        </TableCell>
                                        <TableCell>{quiz.descriptionA}</TableCell>
                                        <TableCell>
                                            {quiz.imageB && (
                                                <img src={quiz.imageB} alt="Option B" style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
                                            )}
                                        </TableCell>
                                        <TableCell>{quiz.descriptionB}</TableCell>
                                        <TableCell>{quiz.preference}</TableCell>
                                        <TableCell>{quiz.view}</TableCell>
                                        <TableCell>
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
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
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
