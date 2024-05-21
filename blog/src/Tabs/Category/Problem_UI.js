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
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const LAST_QUIZ_ID = 3; // 마지막 퀴즈 ID를 상수로 정의

function ProblemUI() {
  const [quizData, setQuizData] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [showNoProblemDialog, setShowNoProblemDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [currentQuizId, setCurrentQuizId] = useState(1);

  useEffect(() => {
    if (currentQuizId <= LAST_QUIZ_ID) {
      fetchQuizData(currentQuizId);
    } else {
      setShowNoProblemDialog(true); // 마지막 퀴즈를 넘어가면 다이얼로그 표시
    }
  }, [currentQuizId]);

  const fetchQuizData = async (quizId) => {
    try {
      const response = await axios.get(`https://valanse.site/quiz/${quizId}`);
      const data = response.data.data;
      if (!data || Object.keys(data).length === 0) {
        setQuizData(null);
        setShowNoProblemDialog(true);
        return;
      }
      setQuizData(data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        handleNext();
      } else {
        console.error('Error fetching quiz data:', error.message);
        setShowNoProblemDialog(true);
      }
    }
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setShowConfirmDialog(true);
  };

  const handleOptionLike = () => {
    setLikes(likes + 1);
  };

  const handleOptionDislike = () => {
    setDislikes(dislikes + 1);
  };

  const handleNext = () => {
    if (currentQuizId < LAST_QUIZ_ID) {
      setSelectedOption(null);
      setShowConfirmDialog(false);
      setCurrentQuizId((prevQuizId) => prevQuizId + 1);
    } else {
      setShowNoProblemDialog(true);
    }
  };

  const handlePrevious = () => {
    const previousQuizId = currentQuizId - 1;
    if (previousQuizId < 1) return;
    setCurrentQuizId(previousQuizId);
  };

  const handleCloseNoProblemDialog = () => {
    setShowNoProblemDialog(false);
  };

  const handleCloseConfirmDialog = () => {
    setShowConfirmDialog(false);
  };

  const handleConfirmSelection = () => {
    handleNext();
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
                onClick={handlePrevious}
                disabled={currentQuizId === 1}
                startIcon={<ArrowBackIcon />}
              >
                Previous
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
      <Dialog
        open={showConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">선택 확인</DialogTitle>
        <DialogContent>
          <Typography variant="body1" id="confirm-dialog-description">
            선택지: {selectedOption}. 정말 선택하시겠습니까?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmDialog} color="primary">
            취소
          </Button>
          <Button onClick={handleConfirmSelection} color="primary" autoFocus>
            확인
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default ProblemUI;
