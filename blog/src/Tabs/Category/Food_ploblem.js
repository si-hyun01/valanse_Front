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
  const [quizData, setQuizData] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);

  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await axios.get('https://valanse.site/quiz/1');
        setQuizData(response.data.data);
      } catch (error) {
        console.error('Error fetching quiz data:', error.message);
      }
    };

    fetchQuizData();
  }, []);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleOptionLike = () => {
    setLikes(likes + 1);
  };

  const handleOptionDislike = () => {
    setDislikes(dislikes + 1);
  };

  const handleNext = () => {
    setSelectedOption(null);
  };

  if (!quizData) {
    return <div>Loading...</div>;
  }

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} style={{ height: '30px' }} />
        <Grid item xs={12}>
          <Typography variant="h4" align="center">{quizData.content}</Typography>
        </Grid>
        <Grid item xs={12} textAlign="center">
          <IconButton onClick={handleOptionLike}>
            <ThumbUpIcon /> {likes}
          </IconButton>
          <IconButton onClick={handleOptionDislike}>
            <ThumbDownIcon /> {dislikes}
          </IconButton>
        </Grid>
        <Grid item xs={6} textAlign="center"> {/* 수정된 부분 */}
          <Card sx={{ maxWidth: 500 }} onClick={() => handleOptionSelect('A')}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="300"
                image={quizData.imageA}
                alt="Option A Image"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {quizData.optionA}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {quizData.descriptionA}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={6} textAlign="center"> {/* 수정된 부분 */}
          <Card sx={{ maxWidth: 500 }} onClick={() => handleOptionSelect('B')}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="300"
                image={quizData.imageB}
                alt="Option B Image"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {quizData.optionB}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {quizData.descriptionB}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={12} textAlign="center">
          <Button variant="contained" color="primary" onClick={handleNext} disabled={!selectedOption}>
            Next
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
}

export default FoodProblem;
