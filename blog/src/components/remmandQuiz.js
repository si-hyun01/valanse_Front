import React from 'react';
import axios from 'axios';
import { Button, Container, Typography } from '@mui/material';

function RecommendQuiz() {
  const handleRecommendClick = async () => {
    try {
      const response = await axios.get('https://valanse.site/quiz/recommend', {
        headers: {
          'accept': 'application/json;charset=UTF-8',
        },
      });
      console.log('Recommended Quiz Data:', response.data);
    } catch (error) {
      console.error('Error fetching recommended quiz:', error.message);
    }
  };

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" align="center" sx={{ mt: 4 }}>
        추천 퀴즈 조회
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleRecommendClick}
        sx={{ mt: 2 }}
      >
        추천 퀴즈 요청
      </Button>
    </Container>
  );
}

export default RecommendQuiz;
