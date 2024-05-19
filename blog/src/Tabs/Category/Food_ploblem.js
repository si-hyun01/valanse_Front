import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
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
  const [showNoProblemDialog, setShowNoProblemDialog] = useState(false);

  useEffect(() => {
    fetchQuizData();
  }, []);

  const fetchQuizData = async () => {
    try {
      const response = await axios.get('https://valanse.site/quiz/' + (quizData ? quizData.quizId + 1 : 1));
      const data = response.data.data;
      if (!data || Object.keys(data).length === 0) { // 데이터가 비어있는 경우
        setQuizData(null);
        setShowNoProblemDialog(true);
        return;
      }
      setQuizData(data);
    } catch (error) {
      console.error('Error fetching quiz data:', error.message);
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

  const handleCloseNoProblemDialog = () => {
    setShowNoProblemDialog(false);
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
              <Button variant="contained" color="primary" onClick={handleNext} disabled={!selectedOption}>
                Next
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Card>
      <Dialog
        open={showNoProblemDialog}
        onClose={handleCloseNoProblemDialog}
        aria-labelledby="no-problem-dialog-title"
        aria-describedby="no-problem-dialog-description"
      >
        <DialogTitle id="no-problem-dialog-title">문제가 없습니다.</DialogTitle>
        <DialogContent>
          <Typography variant="body1" id="no-problem-dialog-description">
            현재 문제가 더 이상 제공되지 않습니다.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNoProblemDialog} color="primary">
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default FoodProblem;
