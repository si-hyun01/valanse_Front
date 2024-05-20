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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function ProblemUI() {
  const [quizData, setQuizData] = useState(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);

  useEffect(() => {
    fetchQuizData();
  }, []);

  const fetchQuizData = async () => {
    try {
      const response = await axios.get('https://valanse.site/quiz/' + (quizData ? quizData.quizId + 1 : 1));
      const data = response.data.data;
      if (!data || Object.keys(data).length === 0 || !data.content) { // 데이터가 없거나 내용이 없는 경우
        fetchNextQuiz(); // 다음 퀴즈 가져오기
        return;
      }
      setQuizData(data);
    } catch (error) {
      console.error('Error fetching quiz data:', error.message);
      if (error.response && error.response.status === 404) { // 퀴즈가 없는 경우
        fetchNextQuiz(); // 다음 퀴즈 가져오기
      }
    }
  };

  const fetchNextQuiz = async () => {
    try {
      const response = await axios.get('https://valanse.site/quiz/' + (quizData ? quizData.quizId + 1 : 1));
      const data = response.data.data;
      if (!data || Object.keys(data).length === 0 || !data.content) { // 데이터가 없거나 내용이 없는 경우
        setQuizData(null);
        console.log("No more quizzes available.");
        return;
      }
      setQuizData(data);
    } catch (error) {
      console.error('Error fetching next quiz data:', error.message);
      setQuizData(null);
    }
  };

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
    fetchQuizData(); // 다음 퀴즈 가져오기
  };

  return (
    <>
      <Card sx={{ bgcolor: '#f5f5f5', borderRadius: '16px' }}>
        <Container maxWidth="lg">
          <Grid container spacing={2} justifyContent="center">
            <Grid item xs={12} style={{ height: '30px' }} />
            <Grid item xs={12}>
              <Typography variant="h4" align="center">{quizData ? quizData.content : ''}</Typography>
            </Grid>
            <Grid item xs={12} textAlign="center">
              <IconButton onClick={handleOptionLike}>
                <ThumbUpIcon /> {likes}
              </IconButton>
              <IconButton onClick={handleOptionDislike}>
                <ThumbDownIcon /> {dislikes}
              </IconButton>
            </Grid>
            <Grid item xs={6} textAlign="center">
              <Card onClick={() => handleOptionSelect('A')} sx={{ borderRadius: '16px' }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="300"
                    image={quizData ? quizData.imageA : ''}
                    alt=""
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {quizData ? quizData.descriptionA : ''}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={6} textAlign="center">
              <Card onClick={() => handleOptionSelect('B')} sx={{ borderRadius: '16px' }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="300"
                    image={quizData ? quizData.imageB : ''}
                    alt=""
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {quizData ? quizData.descriptionB : ''}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={12} textAlign="center">
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={!quizData}
                startIcon={<ArrowBackIcon />}
              >
                Next
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Card>
    </>
  );
}

export default ProblemUI;
