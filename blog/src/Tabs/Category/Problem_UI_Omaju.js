import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Card, CardContent, CardActionArea, CardMedia, Container, Dialog, DialogActions, DialogTitle, DialogContent, Grid, IconButton, Typography, MenuItem, Select } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CommentUI from '../../components/comments';  // CommentUI 컴포넌트 import

function ProblemUI() {
  const [categoryName, setCategoryName] = useState('');
  const [quizDataList, setQuizDataList] = useState([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showNoProblemDialog, setShowNoProblemDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [likedQuizzes, setLikedQuizzes] = useState({});
  const [dislikedQuizzes, setDislikedQuizzes] = useState({});

  useEffect(() => {
    if (categoryName) {
      fetchQuizData(categoryName);
    }
  }, [categoryName]);

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

  const saveUserAnswer = async (quizId, selectedOption) => {
    try {
      const currentQuizData = quizDataList.find((quiz) => quiz.quizId === quizId);
      const response = await axios.post(
        `https://valanse.site/quiz/save-user-answer?category=${encodeURIComponent(categoryName)}`,
        {
          userId: 0, // 사용자 ID를 적절히 설정하세요
          quizId: quizId,
          selectedOption: selectedOption,
          preference: 0, // preference 값을 적절히 설정하세요
          likeCount: currentQuizData.likes,
          unlikeCount: currentQuizData.dislikes,
        },
        {
          headers: {
            'Content-Type': 'application/json;charset=UTF-8',
          },
        }
      );
      console.log('User answer saved:', response.data);
    } catch (error) {
      console.error('Error saving user answer:', error.message);
    }
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
    const currentQuizData = quizDataList[currentQuizIndex];
    saveUserAnswer(currentQuizData.quizId, selectedOption); // 사용자의 답변을 저장하는 함수 호출
    setShowConfirmDialog(false); // 다이얼로그를 닫기
    handleNext(); // 다음 퀴즈로 넘어가기
  };

  const currentQuizData = quizDataList[currentQuizIndex];

  return (
    <Container maxWidth="lg">
      <Select
        value={categoryName}
        onChange={(e) => setCategoryName(e.target.value)}
        displayEmpty
        inputProps={{ 'aria-label': 'Without label' }}
      >
        <MenuItem value="축구">축구</MenuItem>
        <MenuItem value="음식">음식</MenuItem>
        <MenuItem value="연애">연애</MenuItem>
        <MenuItem value="노래">노래</MenuItem>
        <MenuItem value="생존">생존</MenuItem>
        <MenuItem value="드라마&영화">드라마&영화</MenuItem>
        <MenuItem value="일상">일상</MenuItem>
      </Select>
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
      {currentQuizData && (
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2">
              {currentQuizData.question}
            </Typography>
            <CardActionArea onClick={() => handleOptionSelect(currentQuizData.option1, currentQuizData.quizId)}>
              <CardMedia
                component="img"
                alt="option1"
                height="140"
                image={currentQuizData.option1Image}
                title="Option 1"
              />
              <Typography variant="body2" component="p">
                {currentQuizData.option1}
              </Typography>
            </CardActionArea>
            <CardActionArea onClick={() => handleOptionSelect(currentQuizData.option2, currentQuizData.quizId)}>
              <CardMedia
                component="img"
                alt="option2"
                height="140"
                image={currentQuizData.option2Image}
                title="Option 2"
              />
              <Typography variant="body2" component="p">
                {currentQuizData.option2}
              </Typography>
            </CardActionArea>
            <Grid container spacing={2}>
              <Grid item>
                <IconButton onClick={() => handleOptionLike(currentQuizData.quizId)} color="primary">
                  <ThumbUpIcon color={likedQuizzes[currentQuizData.quizId] ? 'primary' : 'inherit'} />
                </IconButton>
                <Typography variant="body2" component="span">
                  {currentQuizData.likes}
                </Typography>
              </Grid>
              <Grid item>
                <IconButton onClick={() => handleOptionDislike(currentQuizData.quizId)} color="secondary">
                  <ThumbDownIcon color={dislikedQuizzes[currentQuizData.quizId] ? 'secondary' : 'inherit'} />
                </IconButton>
                <Typography variant="body2" component="span">
                  {currentQuizData.dislikes}
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
      <Grid container spacing={2} justifyContent="space-between">
        <Grid item>
          <Button variant="contained" color="primary" onClick={handlePrevious} disabled={currentQuizIndex === 0}>
            <ArrowBackIcon />
          </Button>
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleNext}>
            <ArrowForwardIcon />
          </Button>
        </Grid>
      </Grid>
      <CommentUI quizId={currentQuizData?.quizId} />
    </Container>
  );
}

export default ProblemUI;
