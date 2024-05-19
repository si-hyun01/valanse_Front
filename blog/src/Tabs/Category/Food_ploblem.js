import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Grid,
  IconButton,
  Typography
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

function FoodProblem() {
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [selectedExplanation, setSelectedExplanation] = useState(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get('https://valanse.site/quiz/1', {
          headers: {
            'accept': 'application/json;charset=UTF-8',
            // Add any necessary headers here
          }
        });
        setCurrentQuestion(response.data); // 변경된 부분
      } catch (error) {
        console.error('Error fetching quiz data:', error.message);
      }
    };

    fetchQuizData();
  }, []);

  const handleExplanationSelect = (explanation) => {
    setSelectedExplanation(explanation);
  };

  const handleQuestionLike = () => {
    setLikes(likes + 1);
  };

  const handleQuestionDislike = () => {
    setDislikes(dislikes + 1);
  };

  const handleNext = () => {
    // Logic for moving to the next question
    setSelectedExplanation(null);
  };

  if (!currentQuestion || !currentQuestion.explanations) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} style={{ height: '30px' }} />
        <Grid item xs={12}>
          <Typography variant="h4" align="center">{currentQuestion.question}</Typography> {/* 변경된 부분 */}
        </Grid>
        <Grid item xs={12} textAlign="center">
          <IconButton onClick={handleQuestionLike}>
            <ThumbUpIcon /> {likes}
          </IconButton>
          <IconButton onClick={handleQuestionDislike}>
            <ThumbDownIcon /> {dislikes}
          </IconButton>
        </Grid>
        {currentQuestion.explanations.map((explanation, index) => (
          <Grid key={index} item xs={5}>
            <Card sx={{ maxWidth: 500 }} onClick={() => handleExplanationSelect(explanation)}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="300"
                  image={"http://via.placeholder.com/200x150"}
                  alt="Explanation Image"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {explanation}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
        <Grid item xs={12} textAlign="center">
          <Button variant="contained" color="primary" onClick={handleNext} disabled={!selectedExplanation}>
            Next
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default FoodProblem;
