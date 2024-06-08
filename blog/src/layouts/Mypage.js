import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Accordion, AccordionDetails, AccordionSummary, Typography, Table, TableContainer, TableHead, TableRow, TableCell, Button } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Header from './Header';
import EditQuestionDialog from './remake_problem';

const MyPage = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [editDialogOpen, setEditDialogOpen] = useState(false); // 수정 다이얼로그 상태
    const [selectedQuiz, setSelectedQuiz] = useState(null); // 선택된 퀴즈 상태

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
        // 수정하기 버튼 클릭 시 수행할 작업
        setSelectedQuiz(quiz); // 선택된 퀴즈 설정
        setEditDialogOpen(true); // 수정 다이얼로그 열기
    };

    // 수정 다이얼로그 닫기 핸들러
    const handleCloseEditDialog = () => {
        setEditDialogOpen(false);
    };

    // 수정한 퀴즈 정보로 상태 업데이트하는 핸들러
    const handleUpdateQuiz = (updatedQuiz) => {
        // 퀴즈 목록에서 수정된 퀴즈를 찾아 업데이트
        const updatedQuizzes = quizzes.map(quiz =>
            quiz.quizId === updatedQuiz.quizId ? updatedQuiz : quiz
        );
        setQuizzes(updatedQuizzes);
    };

    return (
        <>
            <Header />
            <div>
                <Typography variant="h4" gutterBottom>
                    마이 페이지 개발 중입니다.....
                </Typography>
                <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>퀴즈 목록</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
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
                                <tbody>
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
                                                    onClick={() => handleEdit(quiz)} // 수정하기 핸들러에 선택된 퀴즈 전달
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
                                </tbody>
                            </Table>
                        </TableContainer>
                    </AccordionDetails>
                </Accordion>
                {/* 수정 다이얼로그 */}
                <EditQuestionDialog
                    open={editDialogOpen}
                    handleClose={handleCloseEditDialog}
                    quiz={selectedQuiz}
                    onUpdate={handleUpdate
                    }
                    />
                </div>
            </>
        );
    };
    
    export default MyPage;
    