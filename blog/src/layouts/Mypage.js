import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
            <div style={{ margin: '20px', padding: '20px' }}>
                <Typography variant="h4" gutterBottom>
                    마이 페이지 개발 중입니다.....
                </Typography>
                {quizzes.map((quiz) => (
                    <Accordion key={quiz.quizId}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Typography>{quiz.content}</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <div>
                                <div>
                                    {quiz.imageA && (
                                        <img src={quiz.imageA} alt="Option A" style={{ width: '100%', height: '250px', objectFit: 'cover', marginBottom: '8px' }} />
                                    )}
                                </div>
                                <Typography>{quiz.descriptionA}</Typography>
                                <div>
                                    {quiz.imageB && (
                                        <img src={quiz.imageB} alt="Option B" style={{ width: '100%', height: '250px', objectFit: 'cover', marginBottom: '8px' }} />
                                    )}
                                </div>
                                <Typography>{quiz.descriptionB}</Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleEdit(quiz)}
                                    style={{ marginRight: '8px', marginTop: '8px' }}
                                >
                                    수정하기
                                </Button>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => handleDelete(quiz.quizId)}
                                    style={{ marginTop: '8px' }}
                                >
                                    삭제하기
                                </Button>
                            </div>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </div>
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
