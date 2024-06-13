import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Container, Typography, Button, Card, CardContent } from '@mui/material';
import '../../src/layouts/Mypage.css'; 
import Bground from "../layouts/img/green_hexa.png";
import CreateQuestionDialog from '../layouts/remake_problem'; // 기존 다이얼로그 컴포넌트 임포트

const QuizDetail = ({ quiz, onDelete, onGoBack }) => {
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false); // 삭제 다이얼로그 열림 상태 추가
    const [openEditDialog, setOpenEditDialog] = useState(false); // 수정 다이얼로그 열림 상태 추가

    const handleDeleteConfirmation = () => {
        setOpenDeleteDialog(true); // 삭제하기 버튼 클릭 시 삭제 다이얼로그 열기
    };

    const handleEdit = () => {
        setOpenEditDialog(true); // 수정하기 버튼 클릭 시 수정 다이얼로그 열기
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`https://valanse.site/quiz/${quiz.quizId}`);
            onDelete(quiz.quizId); // 삭제 완료 후 콜백 함수 호출하여 상태 업데이트
            onGoBack(); // 삭제 후 상세 페이지에서 목록 페이지로 이동
        } catch (error) {
            console.error('퀴즈 삭제 중 오류 발생:', error);
        }
    };

    return (
        <Card className="quiz-detail" sx={{ bgcolor: 'black', borderRadius: '16px', p: 2 }}>
            <CardContent>
                <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>{quiz.content}</Typography>
                <Typography variant="subtitle2" sx={{ color: 'white' }}>퀴즈 ID: {quiz.quizId}</Typography>
                <Button onClick={onGoBack} color="primary" sx={{ borderColor: 'lime', color: 'lime' }}>뒤로가기</Button>
                <Button onClick={handleDeleteConfirmation} color="error" sx={{ borderColor: 'red', color: 'red' }}>삭제하기</Button>
                <Button onClick={handleEdit} color="primary" sx={{ borderColor: 'lime', color: 'lime' }}>수정하기</Button>
            </CardContent>
            {/* 삭제 다이얼로그 */}
            {openDeleteDialog && (
                <CreateQuestionDialog
                    open={openDeleteDialog}
                    handleClose={() => setOpenDeleteDialog(false)}
                    quiz={quiz}
                    handleCreate={handleDelete}
                    actionType="delete"
                />
            )}
            {/* 수정 다이얼로그 */}
            {openEditDialog && (
                <CreateQuestionDialog
                    open={openEditDialog}
                    handleClose={() => setOpenEditDialog(false)}
                    quiz={quiz}
                    handleCreate={() => {} /* 수정 처리 함수 추가 */}
                    actionType="edit"
                />
            )}
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
            setQuizzes(prevQuizzes => prevQuizzes.filter(q => q.quizId !== quizId));
            setSelectedQuiz(null);
            setShowDetail(false);
        } catch (error) {
            console.error('퀴즈 삭제 중 오류 발생:', error);
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
                console.error('퀴즈 목록 불러오기 오류:', error);
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
                    />
                )}
            </Container>
        </div>
    );
};

export default MyPage;
