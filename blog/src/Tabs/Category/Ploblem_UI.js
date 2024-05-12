import React, { useState, useEffect } from 'react';
import {
  Button, Card,CardActionArea,CardContent,CardMedia,Container,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle,Grid,IconButton,
  TextField,
  Typography
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

function Comment({ author, text, likes, dislikes, onLike, onDislike }) {
  return (
    <div>
      <Typography variant="subtitle2">{author}</Typography>
      <Typography variant="body2">{text}</Typography>
      <IconButton onClick={onLike}>
        <ThumbUpIcon /> {likes}
      </IconButton>
      <IconButton onClick={onDislike}>
        <ThumbDownIcon /> {dislikes}
      </IconButton>
    </div>
  );
}

function QuestionPage({ question, explanations, onNext, currentUser, currentQuestionIndex, setCurrentQuestionIndex }) {
  const [selectedExplanation, setSelectedExplanation] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState({});
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [questionData, setQuestionData] = useState(null);

  useEffect(() => {
    fetch('http://54.180.170.88:8080/quiz/1')
      .then(response => response.json())
      .then(data => {
        // 서버에서 가져온 퀴즈 데이터를 상태로 설정
        setQuestionData(data);
      })
      .catch(error => console.error('Error fetching quiz data:', error));
  }, []); // 페이지 로드시 한번만 실행

  if (!questionData) {
    return <div>Loading...</div>;
  }

  const handleExplanationSelect = (explanation) => {
    setSelectedExplanation(explanation);
    setOpenDialog(true); // 선택지 클릭 시 다이얼로그 열기
  };

  
}

export default QuestionPage;