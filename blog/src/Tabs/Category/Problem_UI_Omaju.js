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

function ProblemUI({ categoryName }) {
  const [quizDataList, setQuizDataList] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showNoProblemDialog, setShowNoProblemDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [unlikeCount, setUnlikeCount] = useState(0);
  const [likeStatus, setLikeStatus] = useState(null);

  useEffect(() => {
    fetchQuizData(categoryName);
  }, [categoryName]);

  const fetchAllQuizData = async (quizIds) => {
    try {
      const quizDataArray = await Promise.all(
        quizIds.map(async (quizId) => {
          const response = await axios.get(`https://valanse.site/quiz/${quizId}`);
          return response.data.data;
        })
      );
      return quizDataArray;
    } catch (error) {
      console.error('Error fetching quiz data:', error.message);
      return [];
    }
  };

  const fetchQuizData = async (category) => {
    try {
      const response = await axios.get(
        `https://valanse.site/quiz-category/search?keyword=${encodeURIComponent(category)}`
      );
      const data = response.data.data;
      if (!data || data.length === 0) {
        setShowNoProblemDialog(true);
        return;
      }
      const quizIds = data.map((quiz) => quiz.quizId);
      const quizDataArray = await fetchAllQuizData(quizIds);
      setQuizDataList(quizDataArray);
      quizIds.forEach(fetchLikeStats); // 퀴즈 데이터를 불러올 때마다 좋아요 및 싫어요 수도 가져오기
    } catch (error) {
      console.error('Error fetching quiz data:', error.message);
      setShowNoProblemDialog(true);
    }
  };

  const fetchLikeStats = async (quizId) => {
    try {
      const response = await axios.get(`https://valanse.site/quiz/${quizId}/like-stats`);
      const { likeCount, unlikeCount } = response.data;
      setLikeCount((prevCount) => ({ ...prevCount, [quizId]: likeCount })); // quizId에 해당하는 좋아요 수 업데이트
      setUnlikeCount((prevCount) => ({ ...prevCount, [quizId]: unlikeCount })); // quizId에 해당하는 싫어요 수 업데이트
    } catch (error) {
      console.error('Error fetching like stats:', error.message);
    }
  };

  const handleOptionSelect = async (option, quizId) => {
    setSelectedOption(option);
    setShowConfirmDialog(true);
    console.log(quizDataList[currentQuizIndex]); // 선택한 퀴즈의 상세 정보 출력
  };

  const handleOptionLike = async () => {
    try {
      await axios.post(`https://valanse.site/quiz/${currentQuizData.quizId}/increase-preference`);
      setLikeStatus('like');
      setLikeCount((prevCount) => ({ ...prevCount, [currentQuizData.quizId]: prevCount[currentQuizData.quizId] + 1 }));
    } catch (error) {
      console.error('Error liking quiz:', error.message);
    }
  };

  const handleOptionDislike = async () => {
    try {
      await axios.post(`https://valanse.site/quiz/${currentQuizData.quizId}/decrease-preference`);
      setLikeStatus('unlike');
      setUnlikeCount((prevCount) => ({ ...prevCount, [currentQuizData.quizId]: prevCount[currentQuizData.quizId] + 1 }));
    } catch (error) {
      console.error('Error disliking quiz:', error.message);
    }
  };

  const handleNext = async () => {
    const nextIndex = currentQuizIndex + 1;
    if (nextIndex < quizDataList.length) {
      setCurrentQuizIndex(nextIndex);
    } else {
      setShowNoProblemDialog(true);
    }
  };

  const handlePrevious = () => {
    const previousIndex = currentQuizIndex - 1;
    if (previousIndex >= 0) {
      setCurrentQuizIndex(previousIndex);
    }
  };

  const handleCloseNoProblemDialog = () => {
    setShowNoProblemDialog(false);
  };

  const handleCloseConfirmDialog = () => {
    setShowConfirmDialog(false);
  };

  const handleConfirmSelection = () => {
    setShowConfirmDialog(false); // 다이얼로그를 닫기
    handleNext(); // 다음 퀴즈로 넘어가버리기
  };

  const currentQuizData = quizDataList[currentQuizIndex];

  return (
    <Container maxWidth="lg">
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
      <Card sx={{ bgcolor: '#f5f5f5', borderRadius: '16px', mt: 4 }}>
        <Container maxWidth="lg">
          <Grid container spacing={2}>
            <Grid item xs={12} style={{ height: '30px' }} />
            <Grid item xs={12}>
              <Typography variant="h4" align="center">{currentQuizData ? currentQuizData.content : ''}</Typography>
            </Grid>
            <Grid item xs={12} textAlign="center">
              <IconButton onClick={handleOptionLike} color={likeStatus === 'like' ? 'primary' : 'default'}>
                <ThumbUpIcon color={likeStatus === 'like' ? 'primary' : 'inherit'} /> {likeCount}
              </IconButton>
              <IconButton onClick={handleOptionDislike} color={likeStatus === 'unlike' ? 'primary' : 'default'}>
                <ThumbDownIcon color={likeStatus === 'unlike' ? 'primary' : 'inherit'} /> {unlikeCount}
              </IconButton>
            </Grid>
            <Grid item xs={6} textAlign="center">
              <Card onClick={() => handleOptionSelect('A', currentQuizData.quizId)} sx={{ borderRadius: '16px' }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="400"
                    image={currentQuizData ? currentQuizData.imageA : ''}
                    alt=""
                  />
                  <CardContent sx={{ height: '100px' }}>
                    <Typography gutterBottom variant="h5" component="div">
                      {currentQuizData ? currentQuizData.descriptionA : ''}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={6} textAlign="center">
              <Card onClick={() => handleOptionSelect('B', currentQuizData.quizId)} sx={{ borderRadius: '16px' }}>
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="400"
                    image={currentQuizData ? currentQuizData.imageB : ''}
                    alt=""
                  />
                  <CardContent sx={{ height: '100px' }}>
                    <Typography gutterBottom variant="h5" component="div">
                      {currentQuizData ? currentQuizData.descriptionB : ''}
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
                disabled={currentQuizIndex === 0}
                startIcon={<ArrowBackIcon />}
              >
                Previous
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Card>
    </Container>
  );
}

export default ProblemUI;
