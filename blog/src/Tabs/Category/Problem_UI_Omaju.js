import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, CardContent, CardActionArea, CardMedia, Container, Dialog, DialogActions, DialogTitle, DialogContent, Grid, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

function ProblemUI({ categoryName, userId }) { // userId 추가
  const [quizDataList, setQuizDataList] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showNoProblemDialog, setShowNoProblemDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    fetchQuizData(categoryName);
  }, [categoryName]);

  const fetchQuizData = async (category) => {
    try {
      const allQuizzesResponse = await axios.get('https://valanse.site/quiz/all', {
        headers: {
          'accept': 'application/json;charset=UTF-8',
        },
      });
      const allQuizzes = allQuizzesResponse.data.data;

      const categoryResponse = await axios.get(
        `https://valanse.site/quiz-category/search?keyword=${encodeURIComponent(category)}`
      );
      const categoryData = categoryResponse.data;

      await axios.post(`https://valanse.site/quiz/save-user-answer?category=${encodeURIComponent(category)}`, {
        userId: userId, // 사용자 ID 전달
        quizId: 0, // 퀴즈 ID (필요에 따라 수정)
        selectedOption: "", // 선택한 옵션
        preference: 0 // 선호도 (필요에 따라 수정)
      });

      const quizIds = categoryData.quizIds;
      const filteredQuizzes = allQuizzes.filter((quiz) => quizIds.includes(quiz.quizId));
      const quizDataArray = filteredQuizzes.map(quiz => ({
        ...quiz,
        likes: 0,
        dislikes: 0
      }));
      setQuizDataList(quizDataArray);
    } catch (error) {
      console.error('Error fetching quiz data:', error.message);
      setShowNoProblemDialog(true);
    }
  };

  const handleOptionSelect = (option, quizId) => {
    setSelectedOption(option);
    setShowConfirmDialog(true);
  };

  const handleNext = () => {
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

  const handleConfirmSelection = async () => {
    setShowConfirmDialog(false); // 다이얼로그를 닫기

    // 선택한 옵션과 퀴즈 ID를 가져오기
    const selectedOption = selectedOption;
    const quizId = quizDataList[currentQuizIndex].quizId;

    try {
      // 사용자의 답변과 카테고리 통계를 저장하는 API 호출
      await axios.post(`http://valanse.site/quiz/save-user-answer?category=${encodeURIComponent(categoryName)}`, {
        userId: userId, // 사용자 ID 전달
        quizId: quizId,
        selectedOption: selectedOption,
        preference: 0 // 선호도 (필요에 따라 수정)
      });

      // 다음 퀴즈로 넘어가기
      handleNext();
    } catch (error) {
      console.error('Error saving user answer:', error.message);
      // 에러 처리
    }
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
              <Typography variant="h4"align="center" sx={{ color: 'white' }}>
                {currentQuizData ? currentQuizData.content : ''}
              </Typography>
            </Grid>
            <Grid item xs={12} textAlign="center">
              <IconButton onClick={() => handleOptionSelect('A', currentQuizData.quizId)}>
                <Typography variant="body2" sx={{ color: 'white', ml: 1, fontWeight: 'bold' }}>
                  {currentQuizData ? currentQuizData.likes : 0}
                </Typography>
              </IconButton>
              <IconButton onClick={() => handleOptionSelect('B', currentQuizData.quizId)}>
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
          </Grid>
        </Container>
      </Card>
    </Container>
  );
}

export default ProblemUI;

