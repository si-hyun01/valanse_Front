import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, CardContent, CardActionArea, CardMedia, Container, Dialog, DialogActions, DialogTitle, DialogContent, Grid, IconButton, Typography } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CommentUI from '../../components/comments';  // CommentUI 컴포넌트 import

function ProblemUI({ categoryName }) {
  const [quizDataList, setQuizDataList] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showNoProblemDialog, setShowNoProblemDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [likedQuizzes, setLikedQuizzes] = useState({});
  const [dislikedQuizzes, setDislikedQuizzes] = useState({});

  useEffect(() => {
    fetchQuizData(categoryName);
  }, [categoryName]);

  const fetchQuizData = async (category) => {
    try {
      const response = await axios.get('https://valanse.site/quiz/all', {
        headers: {
          'accept': 'application/json;charset=UTF-8',
        },
      });
      const data = response.data.data;
      if (!data || data.length === 0) {
        setShowNoProblemDialog(true);
        return;
      }
      const filteredData = data.filter((quiz) => quiz.category === category);
      if (filteredData.length === 0) {
        setShowNoProblemDialog(true);
        return;
      }
      const quizDataArray = await fetchAllQuizData(filteredData);
      setQuizDataList(quizDataArray);
    } catch (error) {
      console.error('Error fetching quiz data:', error.message);
      setShowNoProblemDialog(true);
    }
  };

  const fetchAllQuizData = async (quizzes) => {
    try {
      const quizDataArray = await Promise.all(
        quizzes.map(async (quiz) => {
          const likeStatsResponse = await axios.get(`https://valanse.site/quiz/${quiz.quizId}/like-stats`);
          return {
            ...quiz,
            likes: likeStatsResponse.data.data.likeCount,
            dislikes: likeStatsResponse.data.data.unlikeCount,
          };
        })
      );
      return quizDataArray;
    } catch (error) {
      console.error('Error fetching quiz data:', error.message);
      return [];
    }
  };

  const handleOptionSelect = async (option, quizId) => {
    setSelectedOption(option);
    setShowConfirmDialog(true);
    console.log(quizDataList[currentQuizIndex]); // 선택한 퀴즈의 상세 정보 출력
  };

  const handleOptionLike = async (quizId) => {
    try {
      const isLiked = likedQuizzes[quizId];
      const response = isLiked
        ? await axios.post(`https://valanse.site/quiz/${quizId}/decrease-preference`)
        : await axios.post(`https://valanse.site/quiz/${quizId}/increase-preference`);

      console.log(isLiked ? 'Dislike response:' : 'Like response:', response.data);

      setQuizDataList((prevQuizDataList) => {
        const updatedQuizDataList = prevQuizDataList.map((quiz) =>
          quiz.quizId === quizId
            ? {
              ...quiz,
              likes: quiz.likes + (isLiked ? -1 : 1),
            }
            : quiz
        );
        return updatedQuizDataList;
      });

      setLikedQuizzes((prevLikedQuizzes) => ({
        ...prevLikedQuizzes,
        [quizId]: !isLiked,
      }));
    } catch (error) {
      console.error('Error liking/unliking quiz:', error.message);
      // 에러 처리
    }
  };

  const handleOptionDislike = async (quizId) => {
    try {
      const isDisliked = dislikedQuizzes[quizId];
      const response = isDisliked
        ? await axios.post(`https://valanse.site/quiz/${quizId}/decrease-preference`)
        : await axios.post(`https://valanse.site/quiz/${quizId}/increase-preference`);

      console.log(isDisliked ? 'Dislike response:' : 'Like response:', response.data);

      setQuizDataList((prevQuizDataList) => {
        const updatedQuizDataList = prevQuizDataList.map((quiz) =>
          quiz.quizId === quizId
            ? {
              ...quiz,
              dislikes: quiz.dislikes + (isDisliked ? -1 : 1),
            }
            : quiz
        );
        return updatedQuizDataList;
      });

      setDislikedQuizzes((prevDislikedQuizzes) => ({
        ...prevDislikedQuizzes,
        [quizId]: !isDisliked,
      }));
    } catch (error) {
      console.error('Error disliking/unliking quiz:', error.message);
      // 에러 처리
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
    handleNext(); // 다음 퀴즈로 넘어가기
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
      <Card
        sx={{
          bgcolor: 'black',
          borderRadius: '16px',
          mt: 4,
          boxShadow: '0px 0px 20px 0px rgba(0, 255, 255, 0.75)',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={2}>
            <Grid item xs={12} style={{ height: '30px' }} />
            <Grid item xs={12}>
              <Typography variant="h4" align="center" sx={{ color: 'white' }}>
                {currentQuizData ? currentQuizData.content : ''}
              </Typography>
            </Grid>
            <Grid item xs={12} textAlign="center">
              <IconButton onClick={() => handleOptionLike(currentQuizData.quizId)}>
                <ThumbUpIcon sx={{ color: 'white' }} />
                <Typography variant="body2" sx={{ color: 'white', ml: 1, fontWeight: 'bold' }}>
                  {currentQuizData ? currentQuizData.likes : 0}
                </Typography>
              </IconButton>
              <IconButton onClick={() => handleOptionDislike(currentQuizData.quizId)}>
                <ThumbDownIcon sx={{ color: 'white' }} />
                <Typography variant="body2" sx={{ color: 'white', ml: 1, fontWeight: 'bold' }}>
                  {currentQuizData ? currentQuizData.dislikes : 0}
                </Typography>
              </IconButton>
            </Grid>
            <Grid item xs={6} textAlign="center">
              <Card
                onClick={() => handleOptionSelect('A', currentQuizData.quizId)}
                sx={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0px 0px 20px 0px rgba(0, 255, 255, 0.75)',
                }}
              >
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="400"
                    image={currentQuizData ? currentQuizData.imageA : ''}
                    alt=""
                  />
                  <CardContent sx={{ height: '100px', backgroundColor: 'black' }}>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      sx={{ color: 'white' }}
                    >
                      {currentQuizData ? currentQuizData.descriptionA : ''}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
            <Grid item xs={6} textAlign="center">
              <Card
                onClick={() => handleOptionSelect('B', currentQuizData.quizId)}
                sx={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0px 0px 20px 0px rgba(0, 255, 255, 0.75)',
                }}
              >
                <CardActionArea>
                  <CardMedia
                    component="img"
                    height="400"
                    image={currentQuizData ? currentQuizData.imageB : ''}
                    alt=""
                  />
                  <CardContent sx={{ height: '100px', backgroundColor: 'black' }}>
                    <Typography
                      gutterBottom
                      variant="h5"
                      component="div"
                      sx={{ color: 'white' }}
                    >
                      {currentQuizData ? currentQuizData.descriptionB : ''}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>

            <Grid item xs={6} textAlign="center">
              <Button
                variant="contained"
                color="primary"
                onClick={handlePrevious}
                disabled={currentQuizIndex === 0}
                startIcon={<ArrowBackIcon />}
                sx={{ bgcolor: 'limegreen', color: 'white' }}
              >
                이전으로
              </Button>
            </Grid>
            <Grid item xs={6} textAlign="center">
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                disabled={currentQuizIndex === quizDataList.length - 1}
                endIcon={<ArrowForwardIcon />}
                sx={{ bgcolor: 'limegreen', color: 'white' }}
              >
                다음으로
              </Button>
            </Grid>
            <Grid item xs={12}>
              {currentQuizData && <CommentUI quizId={currentQuizData.quizId} />} {/* CommentUI 컴포넌트 추가 */}
            </Grid>
          </Grid>
        </Container>
      </Card>
    </Container>
  );
}

export default ProblemUI;
