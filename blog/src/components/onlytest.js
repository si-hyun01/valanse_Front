import React, { useState } from 'react';
import axios from 'axios';
import { Button, Container, Typography, TextField } from '@mui/material';

function CheckUserAnswer() {
  const [quizId, setQuizId] = useState('');
  const [userAnswer, setUserAnswer] = useState(null);

  const handleQuizIdChange = (event) => {
    setQuizId(event.target.value);
  };

  const handleCheckUserAnswer = async () => {
    try {
      const response = await axios.get(`https://valanse.site/quiz/check-user-answer/${quizId}`);
      console.log('User answer for quiz', quizId, ':', response.data);
      setUserAnswer(response.data); // 유저의 풀이 기록 설정
    } catch (error) {
      console.error('Error fetching user answer:', error.message);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" align="center" sx={{ mt: 4 }}>
        특정 문제 풀이 확인
      </Typography>
      <TextField
        label="문제 번호 입력"
        variant="outlined"
        value={quizId}
        onChange={handleQuizIdChange}
        fullWidth
        sx={{ mt: 2 }}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleCheckUserAnswer}
        sx={{ mt: 2 }}
      >
        확인
      </Button>
      {userAnswer && (
        <Typography variant="body1" sx={{ mt: 2 }}>
          유저의 풀이 기록: {userAnswer}
        </Typography>
      )}
    </Container>
  );
}

export default CheckUserAnswer;
