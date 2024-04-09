import React, { useState } from 'react';
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
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
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

function QuestionPage({ question, explanations, onNext, currentUser }) {
  const [selectedExplanation, setSelectedExplanation] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState({});
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);

  const handleExplanationSelect = (explanation) => {
    setSelectedExplanation(explanation);
    setOpenDialog(true); // 선택지 클릭 시 다이얼로그 열기
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmChoice = () => {
    console.log("선택한 설명으로 진행합니다:", selectedExplanation);
    onNext(selectedExplanation);
    setSelectedExplanation(null); // 다음 문제를 위해 선택한 설명 초기화
    setCommentText(''); // 댓글 입력 필드 비우기
    setOpenDialog(false); // 다이얼로그 닫기
  
    // 추천 카운트와 싫어요 카운트 초기화
    setLikes(0);
    setDislikes(0);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim() !== '') {
      setComments({
        ...comments,
        [selectedExplanation]: [
          ...(comments[selectedExplanation] || []),
          {
            author: currentUser ? currentUser.nickname : '익명',
            text: commentText,
            likes: 0,
            dislikes: 0
          }
        ]
      });
      setCommentText('');
    }
  };

  const handleCommentLike = (explanation, index) => {
    const newComments = { ...comments };
    newComments[explanation][index].likes += 1;
    setComments(newComments);
  };

  const handleCommentDislike = (explanation, index) => {
    const newComments = { ...comments };
    newComments[explanation][index].dislikes += 1;
    setComments(newComments);
  };

  const handleQuestionLike = () => {
    setLikes(likes + 1);
  };

  const handleQuestionDislike = () => {
    setDislikes(dislikes + 1);
  };

  const handleNoChoice = () => {
    onNext(null); // 선택하지 않은 것으로 처리
    setComments({}); // 댓글 초기화
    setCommentText(''); // 댓글 입력 필드 비우기
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} style={{ height: '30px' }} />
        <Grid item xs={12}>
          <Typography variant="h4" align="center">{question}</Typography>
        </Grid>
        <Grid item xs={12} textAlign="center">
          <IconButton onClick={handleQuestionLike}>
            <ThumbUpIcon /> {likes}
          </IconButton>
          <IconButton onClick={handleQuestionDislike}>
            <ThumbDownIcon /> {dislikes}
          </IconButton>
        </Grid>
        {explanations.map((explanation, index) => (
          <Grid key={index} item xs={5}>
            <Card sx={{ maxWidth: 500 }} onClick={() => handleExplanationSelect(explanation)}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="300"
                  image={"http://via.placeholder.com/200x150"}
                  alt="Soccer Image"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {explanation}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
        <Grid item xs={12} textAlign="center">
          <Button variant="contained" color="secondary" onClick={handleNoChoice}>
            선택하지 않고 진행
          </Button>
        </Grid>
        <Grid item xs={12}>
          <form onSubmit={handleCommentSubmit}>
            <TextField
              id="comment"
              label="이 문제에 댓글을 입력해보세요."
              fullWidth
              variant="outlined"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
            />
            <Button type="submit" variant="contained" color="primary">댓글 남기기</Button>
          </form>
        </Grid>
        {comments[selectedExplanation] && comments[selectedExplanation].length > 0 && (
          <Grid item xs={12}>
            <Typography variant="h6">댓글</Typography>
            {comments[selectedExplanation].map((comment, index) => (
              <Comment
                key={index}
                author={comment.author}
                text={comment.text}
                likes={comment.likes}
                dislikes={comment.dislikes}
                onLike={() => handleCommentLike(selectedExplanation, index)}
                onDislike={() => handleCommentDislike(selectedExplanation, index)}
              />
            ))}
          </Grid>
        )}
      </Grid>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"선택한 설명으로 진행하시겠습니까?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            선택한 설명으로 진행하시겠습니까?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            아니오
          </Button>
          <Button onClick={handleConfirmChoice} color="primary" autoFocus>
            예
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedExplanations, setSelectedExplanations] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const handleNext = (selectedExplanation) => {
    setSelectedExplanations([...selectedExplanations, selectedExplanation]);
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // 마지막 문제를 처리합니다
    }
  };

  const questions = [
    {
      question: "문제 제목이 나타나는 곳입니다.",
      explanations: ["반 페르시의 맨유 이적", "솔 캠벨의 아스날 이적"]
    },
    {
      question: "무인도에 떨어지면 무엇을 가지고 시작하고 싶은가요?",
      explanations: ["라이터", "텐트"]
    }
  ];

  if (questions.length === 0) {
    return <div>문제가 없습니다</div>;
  }

  return (
    <QuestionPage
      question={questions[currentQuestionIndex].question}
      explanations={questions[currentQuestionIndex].explanations}
      onNext={handleNext}
      currentUser={currentUser}
    />
  );
}

export default App;
