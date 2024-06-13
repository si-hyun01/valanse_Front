import React, { useEffect, useState } from "react";
import axios from 'axios';
import { Container, Typography, Button, Card, CardContent } from '@mui/material';
import '../../src/layouts/Mypage.css'; 
import Bground from "../layouts/img/green_hexa.png";
import CreateQuestionDialog from '../layouts/remake_problem'; 

const QuizDetail = ({ quiz, onDelete, onGoBack }) => {
    const [openDialog, setOpenDialog] = useState(false); // 다이얼로그 열림 상태 추가
    const [actionType, setActionType] = useState(''); // 액션 타입 상태 추가 (delete 또는 edit)

    const handleDeleteConfirmation = () => {
        setOpenDialog(true);
        setActionType('delete'); // 삭제 버튼 클릭 시 액션 타입을 delete로 설정
    };

    const handleEdit = () => {
        setOpenDialog(true);
        setActionType('edit'); // 수정 버튼 클릭 시 액션 타입을 edit으로 설정
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
            {/* 새로운 다이얼로그 */}
            <CreateQuestionDialog
                open={openDialog}
                handleClose={() => setOpenDialog(false)}
                quiz={quiz}
                handleCreate={onDelete}
                actionType={actionType} // 액션 타입을 다이얼로그에 전달
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
            setQuizzes(prevQuizzes => prevQuizzes.filter(quiz => quiz.quizId !== quizId));
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
