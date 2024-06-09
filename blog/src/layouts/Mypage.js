import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, TextField, Card, CardContent } from '@mui/material';
import axios from 'axios';
import './Mypage.css';

const QuizDetail = ({ quiz, onDelete, onGoBack, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(quiz.content);
  const [editedDescriptionA, setEditedDescriptionA] = useState(quiz.descriptionA);
  const [editedDescriptionB, setEditedDescriptionB] = useState(quiz.descriptionB);

  const handleUpdate = () => {
    onUpdate(quiz.quizId, editedContent, editedDescriptionA, editedDescriptionB);
    setIsEditing(false);
  };

  return (
    <Card className="custom-card">
      <CardContent>
        {isEditing ? (
          <>
            <TextField
              label="Quiz Content"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description A"
              value={editedDescriptionA}
              onChange={(e) => setEditedDescriptionA(e.target.value)}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Description B"
              value={editedDescriptionB}
              onChange={(e) => setEditedDescriptionB(e.target.value)}
              fullWidth
              margin="normal"
            />
            <Button onClick={handleUpdate} color="primary">확인</Button>
            <Button onClick={() => setIsEditing(false)} color="secondary">취소</Button>
          </>
        ) : (
          <>
            <Typography variant="h6" gutterBottom>{quiz.content}</Typography>
            <Typography variant="body1">
              <strong>Left Description:</strong> {quiz.descriptionA}
            </Typography>
            <Typography variant="body1">
              <strong>Right Description:</strong> {quiz.descriptionB}
            </Typography>
            {quiz.imageA && (
              <img src={quiz.imageA} alt="Option A" style={{ width: '100%', height: '250px', objectFit: 'cover', marginBottom: '8px' }} />
            )}
            {quiz.imageB && (
              <img src={quiz.imageB} alt="Option B" style={{ width: '100%', height: '250px', objectFit: 'cover', marginBottom: '8px' }} />
            )}
            <Button onClick={onGoBack} color="primary">뒤로가기</Button>
            <Button onClick={() => onDelete(quiz.quizId)} color="error">삭제하기</Button>
            <Button onClick={() => setIsEditing(true)} color="primary">수정하기</Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const QuizList = ({ quizzes, onItemClick }) => {
  return (
    <div className="custom-table">
      <table>
        <thead>
          <tr>
            <th>제목</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz) => (
            <tr key={quiz.quizId} onClick={() => onItemClick(quiz)}>
              <td>{quiz.content}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const QuizBoard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const handleQuizClick = async (quiz) => {
    setSelectedQuiz(quiz);
    setShowDetail(true);
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      await axios.delete(`https://valanse.site/quiz/${quizId}`);
      setQuizzes(quizzes.filter(item => item.quizId !== quizId));
      setSelectedQuiz(null);
      setShowDetail(false);
    } catch (error) {
      console.error('Error deleting quiz:', error);
      alert('Failed to delete the quiz. Please try again.');
    }
  };

  const handleUpdateQuiz = async (quizId, content, descriptionA, descriptionB) => {
    try {
      await axios.patch(`https://valanse.site/quiz/${quizId}`, {
        quizRegisterDto: {
          content,
          descriptionA,
          descriptionB
        }
      });
      setQuizzes(quizzes.map(quiz => (quiz.quizId === quizId ? { ...quiz, content, descriptionA, descriptionB } : quiz)));
      setSelectedQuiz({ ...selectedQuiz, content, descriptionA, descriptionB });
    } catch (error) {
      console.error('Error updating quiz:', error);
      alert('Failed to update the quiz. Please try again.');
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
    <Container className="neon-container" style={{ marginTop: '50px', maxWidth: "80%" }}>
      <Typography variant="h4" className="custom-title">
        퀴즈 목록
      </Typography>
      {!showDetail ? (
        <>
          <QuizList quizzes={quizzes} onItemClick={handleQuizClick} />
          <Button variant="contained" color="primary" className="custom-button" style={{ marginTop: '30px' }}>
            퀴즈 작성하기
          </Button>
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
  );
};

export default QuizBoard;
