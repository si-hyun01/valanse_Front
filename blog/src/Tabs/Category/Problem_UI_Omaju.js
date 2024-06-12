import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, CardContent, CardActionArea, CardMedia, Container, Dialog, DialogActions, DialogTitle, DialogContent, Grid, Typography, Checkbox, FormControlLabel } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CommentUI from '../../components/comments';

function ProblemUI({ categoryName }) {
  const [quizDataList, setQuizDataList] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [preference, setPreference] = useState(0);
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
      const categoryQuizzes = categoryResponse.data.data;
      const quizIds = categoryQuizzes.map((quiz) => quiz.quizId);
      const filteredQuizzes = allQuizzes.filter((quiz) => quizIds.includes(quiz.quizId));

      // 사용자가 푼 퀴즈 목록을 저장할 배열
      const answeredQuizzes = [];

      // 각 퀴즈에 대해 사용자가 이미 답변했는지 확인
      for (const quiz of filteredQuizzes) {
        try {
          // 사용자가 퀴즈를 이미 풀었는지 확인하는 요청
          const response = await axios.post('https://valanse.site/quiz/save-user-answer', {
            quizId: quiz.quizId,
          });
          // 만약 사용자가 퀴즈를 풀었다면, 답변 목록에 추가하지 않음
          if (response.data.status === 200) {
            answeredQuizzes.push(quiz.quizId);
          }
        } catch (error) {
          console.error('퀴즈 답변 확인 중 오류 발생:', error.message);
        }
      }

      // 사용자가 풀지 않은 퀴즈만 반환
      const quizDataArray = filteredQuizzes.filter(quiz => !answeredQuizzes.includes(quiz.quizId))
        .map(quiz => ({
          ...quiz,
          likes: 0,
          dislikes: 0
        }));
      setQuizDataList(quizDataArray);
    } catch (error) {
      console.error('퀴즈 데이터 불러오기 중 오류 발생:', error.message);
      setShowNoProblemDialog(true);
    }
  };

  const handleOptionSelect = async (option, quizId) => {
    setSelectedOption(option);
    setShowConfirmDialog(true);
    console.log(quizDataList[currentQuizIndex]);
  };

  const handleNext = async () => {
    const nextIndex = currentQuizIndex + 1;
    if (nextIndex < quizDataList.length) {
      try {
        await saveUserAnswer();
        setCurrentQuizIndex(nextIndex);
      } catch (error) {
        console.error('Error saving user answer:', error.message);
      }
    } else {
      setShowNoProblemDialog(true);
    }
  };

  const handleNext2 = () => {
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
    setShowConfirmDialog(false);
    try {
      handleNext();
    } catch (error) {
      console.error('Error saving user answer:', error.message);
    }
  };

  const handlePreferenceChange = (value) => {
    setPreference(value);
  };

  const saveUserAnswer = async () => {
    try {
      const response = await axios.post('https://valanse.site/quiz/save-user-answer', {
        quizId: quizDataList[currentQuizIndex].quizId,
        selectedOption: selectedOption,
        preference: preference
      });
      console.log('User answer saved:', response.data);
    } catch (error) {
      console.error('Error saving user answer:', error.message);
      throw new Error('Failed to save user answer');
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
          <Typography variant="body2" sx={{ color: 'black', mt: 2 }}>
            이 퀴즈에 대해 평가를 내려주세요.
          </Typography>
          <FormControlLabel
            control={<Checkbox checked={preference === -2} onChange={() => handlePreferenceChange(-2)} />}
            label={
              <Typography variant="body1" sx={{ color: 'black' }}>
                매우 싫음
              </Typography>
            }
            sx={{ bgcolor: 'transparent' }}
          />
          <FormControlLabel
            control={<Checkbox checked={preference === -1} onChange={() => handlePreferenceChange(-1)} />}
            label={
              <Typography variant="body1" sx={{ color: 'black' }}>
                싫음
              </Typography>
            }
            sx={{ bgcolor: 'transparent' }}
          />
          <FormControlLabel
            control={<Checkbox checked={preference === 0} onChange={() => handlePreferenceChange(0)} />}
            label={
              <Typography variant="body1" sx={{ color: 'black' }}>
                보통
              </Typography>
            }
            sx={{ bgcolor: 'transparent' }}
          />
          <FormControlLabel
            control={<Checkbox checked={preference === 1} onChange={() => handlePreferenceChange(1)} />}
            label={
              <Typography variant="body1" sx={{ color: 'black' }}>
                좋음
              </Typography>
            }
            sx={{ bgcolor: 'transparent' }}
          />
          <FormControlLabel
            control={<Checkbox checked={preference === 2} onChange={() => handlePreferenceChange(2)} />}
            label={
              <Typography variant="body1" sx={{ color: 'black' }}>
                매우 좋음
              </Typography>
            }
            sx={{ bgcolor: 'transparent' }}
          />
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
                onClick={handleNext2}
                disabled={currentQuizIndex === quizDataList.length - 1}
                endIcon={<ArrowForwardIcon />}
                sx={{ bgcolor: 'limegreen', color: 'white' }}
              >
                다음으로
              </Button>
            </Grid>
            <Grid item xs={12}>
              {currentQuizData && <CommentUI quizId={currentQuizData.quizId} />}
            </Grid>
          </Grid>
        </Container>
      </Card>
    </Container>
  );
}

export default ProblemUI;
