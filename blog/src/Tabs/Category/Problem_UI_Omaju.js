import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  Button,
  Card,
  CardContent,
  CardActionArea,
  CardMedia,
  Container,
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  Grid,
  Typography,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CommentUI from '../../components/comments';

function ProblemUI() {
  const { categoryName, quizId } = useParams(); // React Router의 useParams를 사용하여 categoryName과 quizId를 가져옴

  const [quizDataList, setQuizDataList] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [preference, setPreference] = useState(0);
  const [showNoProblemDialog, setShowNoProblemDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    fetchQuizData(categoryName); // 컴포넌트가 마운트되거나 categoryName이 변경될 때마다 퀴즈 데이터를 가져옴
  }, [categoryName]);

  // 카테고리명을 기반으로 퀴즈 데이터를 가져오는 함수
  const fetchQuizData = async (category) => {
    try {
      // 전체 퀴즈 데이터를 가져오는 요청
      const allQuizzesResponse = await axios.get('https://valanse.site/quiz/all', {
        headers: {
          'accept': 'application/json;charset=UTF-8',
        },
      });
      const allQuizzes = allQuizzesResponse.data.data;

      // 카테고리에 해당하는 퀴즈 ID들을 검색하여 필터링
      const categoryResponse = await axios.get(
        `https://valanse.site/quiz-category/search?keyword=${encodeURIComponent(category)}`
      );
      const categoryQuizzes = categoryResponse.data.data;
      const quizIds = categoryQuizzes.map((quiz) => quiz.quizId);
      const filteredQuizzes = allQuizzes.filter((quiz) => quizIds.includes(quiz.quizId));

      // 이미 푼 퀴즈를 저장할 배열
      const answeredQuizzes = [];

      // 각 퀴즈에 대해 사용자가 이미 답변했는지 확인
      for (const quiz of filteredQuizzes) {
        try {
          // 사용자가 퀴즈를 이미 풀었는지 확인하는 요청
          const response = await axios.get(`https://valanse.site/quiz/check-user-answer/${quiz.quizId}`);
          // 만약 사용자가 퀴즈를 풀었다면, answeredQuizzes에 추가
          if (response.data.status === 200 && response.data.data === "User has answered the quiz") {
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

  // 선택한 옵션을 처리하는 함수
  const handleOptionSelect = async (option, quizId) => {
    setSelectedOption(option);
    setShowConfirmDialog(true);
  };

  // 다음 퀴즈로 이동하는 함수
  const handleNext = async () => {
    const nextIndex = currentQuizIndex + 1;
    if (nextIndex < quizDataList.length) {
      try {
        await saveUserAnswer(); // 사용자 답변 저장
        setCurrentQuizIndex(nextIndex);
      } catch (error) {
        console.error('사용자 답변 저장 중 오류 발생:', error.message);
      }
    } else {
      setShowNoProblemDialog(true);
    }
  };

  // 다음 퀴즈로 이동하는 함수 (사용자 답변 저장 X)
  const handleNext2 = () => {
    const nextIndex = currentQuizIndex + 1;
    if (nextIndex < quizDataList.length) {
      setCurrentQuizIndex(nextIndex);
    } else {
      setShowNoProblemDialog(true);
    }
  };

  // 이전 퀴즈로 이동하는 함수
  const handlePrevious = () => {
    const previousIndex = currentQuizIndex - 1;
    if (previousIndex >= 0) {
      setCurrentQuizIndex(previousIndex);
    }
  };

  // 문제 없음 다이얼로그 닫기
  const handleCloseNoProblemDialog = () => {
    setShowNoProblemDialog(false);
  };

  // 선택 확인 다이얼로그 닫기
  const handleCloseConfirmDialog = () => {
    setShowConfirmDialog(false);
  };

  // 선택 확인 처리
  const handleConfirmSelection = async () => {
    setShowConfirmDialog(false);
    try {
      await handleNext(); // 다음 퀴즈로 이동
    } catch (error) {
      console.error('사용자 답변 저장 중 오류 발생:', error.message);
    }
  };

  // 선호도 변경 처리
  const handlePreferenceChange = (value) => {
    setPreference(value);
  };

  // 사용자 답변 저장하는 함수
  const saveUserAnswer = async () => {
    try {
      const response = await axios.post('https://valanse.site/quiz/save-user-answer', {
        quizId: quizDataList[currentQuizIndex].quizId,
        selectedOption: selectedOption,
        preference: preference
      });
      console.log('사용자 답변 저장됨:', response.data);
    } catch (error) {
      console.error('사용자 답변 저장 중 오류 발생:', error.message);
      throw new Error('사용자 답변 저장 실패');
    }
  };

  // 현재 퀴즈 데이터
  const currentQuizData = quizDataList[currentQuizIndex];

  return (
    <Container maxWidth="lg">
      {/* 문제 없음 다이얼로그 */}
      <Dialog
        open={showNoProblemDialog}
        onClose={handleCloseNoProblemDialog}
        aria-labelledby="no-problem-dialog-title"
        aria-describedby="no-problem-dialog-description"
      >
        <DialogTitle id="no-problem-dialog-title">문제가 없습니다.</DialogTitle>
        <DialogContent>
          <Typography variant="body1" id="no-problem-dialog-description">
            현재 더 이상 제공할 문제가 없습니다.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseNoProblemDialog} color="primary">
            확인
          </Button>
        </DialogActions>
      </Dialog>

      {/* 선택 확인 다이얼로그 */}
      <Dialog
        open={showConfirmDialog}
        onClose={handleCloseConfirmDialog}
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
      >
        <DialogTitle id="confirm-dialog-title">선택 확인</DialogTitle>
        <DialogContent>
          <Typography variant="body1" id="confirm-dialog-description">
            선택한 옵션: {selectedOption}. 정말 선택하시겠습니까?
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
      {/* 퀴즈 카드 */}
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
            {/* 상단 여백 */}
            <Grid item xs={12} style={{ height: '30px' }} />

            {/* 퀴즈 질문 */}
            <Grid item xs={12}>
              <Typography variant="h4" align="center" sx={{ color: 'white' }}>
                {currentQuizData ? currentQuizData.content : ''}
              </Typography>
            </Grid>

            {/* 선택지 A */}
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

            {/* 선택지 B */}
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

            {/* 이전 퀴즈로 가는 버튼 */}
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

            {/* 다음 퀴즈로 가는 버튼 */}
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

            {/* 댓글 UI */}
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