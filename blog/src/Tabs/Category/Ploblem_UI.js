import React, { useState, useEffect } from 'react';
import {Button,Card,CardActionArea,CardContent,CardMedia,Container,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle,Grid,IconButton,TextField,
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

function QuestionPage({ questions, onNext, currentUser }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedExplanation, setSelectedExplanation] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState({});
  const [likes, setLikes] = useState(0);
  const [dislikes, setDislikes] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const handleExplanationSelect = (explanation) => {
    setSelectedExplanation(explanation);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmChoice = () => {
    console.log("정말 이 선택지를 선택하겠습니까?:", selectedExplanation);
    onNext(selectedExplanation);
    setSelectedExplanation(null); 
    setCommentText(''); 
    setOpenDialog(false); 
    setLikes(0);
    setDislikes(0);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim() !== '') {
      setComments({
        comments,
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
    onNext(null); 
    setComments({}); 
    setCommentText(''); 
  };

  const handlePreviousQuestion = () => {
    onNext(null); 
    setSelectedExplanation(null);
    setComments({});
    setCommentText('');
    if (currentQuestionIndex - 1 >= 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      // 처음 문제입니다. 특별한 처리를 하세요.
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (questions.length === 0) {
    return <div>No questions available</div>;
  }

  const question = questions[currentQuestionIndex];

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} style={{ height: '30px' }} />
        <Grid item xs={12}>
          <Typography variant="h4" align="center">{question.question}</Typography>
        </Grid>
        <Grid item xs={12} textAlign="center">
          <IconButton onClick={handleQuestionLike}>
            <ThumbUpIcon /> {likes}
          </IconButton>
          <IconButton onClick={handleQuestionDislike}>
            <ThumbDownIcon /> {dislikes}
          </IconButton>
        </Grid>
        {question.explanations.map((explanation, index) => (
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
        <Grid item xs={6} textAlign="center">
          <Button variant="contained" color="primary" onClick={handlePreviousQuestion}>
            이전 문제로 돌아가기
          </Button>
        </Grid>
        <Grid item xs={6} textAlign="center">
          <Button variant="contained" color="primary" onClick={handleNoChoice}>
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
        <DialogTitle id="alert-dialog-title">{"선택 확인"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            정말 이 선택지를 선택하시겠습니까?
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
  const [questions, setQuestions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await fetch('http://54.180.170.88:8080/quiz/1');
        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }
        const data = await response.json();
        setQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    }

    fetchQuestions();
  }, []);

  const handleNext = (selectedExplanation) => {
    // handleNext 로직을 추가하고 필요에 맞게 구현합니다.
  };

  return (
    <QuestionPage
      questions={questions}
      onNext={handleNext}
      currentUser={currentUser}
    />
  );
}

export default App;
