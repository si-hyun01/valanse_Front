import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Grid,
  IconButton,
  TextField,
  Typography
} from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';

// 댓글을 나타내는 컴포넌트에요
function Comment({ text, likes, dislikes, onLike, onDislike }) {
  return (
    <div>
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

function QuestionPage({ question, explanations, onNext }) {
  const [selectedExplanation, setSelectedExplanation] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState({});
  const [likes, setLikes] = useState(0); // 문제에 대한 좋아요 
  const [dislikes, setDislikes] = useState(0); // 문제에 대한 싫어요 

  // 문제 설명을 업데이트
  const handleExplanationSelect = (explanation) => {
    setSelectedExplanation(explanation);
    // 다른 문제를 선택할 때마다 댓글을 초기화
    setComments({});
    setCommentText(''); // 댓글 입력 필드 비우기
  };

  // 댓글 추가
  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim() !== '') {
      setComments({ ...comments, [selectedExplanation]: [...(comments[selectedExplanation] || []), { text: commentText, likes: 0, dislikes: 0 }] });
      setCommentText(''); // 입력 필드 비우기
    }
  };

  // 댓글 추천
  const handleCommentLike = (explanation, index) => {
    const newComments = { ...comments };
    newComments[explanation][index].likes += 1;
    setComments(newComments);
  };

  // 댓글 비추천
  const handleCommentDislike = (explanation, index) => {
    const newComments = { ...comments };
    newComments[explanation][index].dislikes += 1;
    setComments(newComments);
  };

  const handleQuestionLike = () => {
    setLikes(likes + 1);
  };

  // 문제에 대한 싫어요 처리
  const handleQuestionDislike = () => {
    setDislikes(dislikes + 1);
  };

  // 다음으로 진행
  const handleNext = () => {
    onNext(selectedExplanation);
    setSelectedExplanation(null); // 다음 문제를 위해 선택한 설명을 초기화합니다.
    setCommentText(''); // 댓글 입력 필드 비우기
  };

  // 선택하지 않고 다음으로 진행합니다.
  const handleNoChoice = () => {
    onNext(null); // 선택하지 않은 것으로 처리합니다.
    setComments({}); // 댓글을 초기화합니다.
    setCommentText(''); // 댓글 입력 필드 비우기
  };

  return (
    <Container maxWidth="lg">
      {/* 문제 설명 */}
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} style={{ height: '30px' }} />
        <Grid item xs={12}>
          <Typography variant="h4" align="center">{question}</Typography>
        </Grid>
        {/* 문제에 대한 좋아요와 싫어요 버튼 */}
        <Grid item xs={12} textAlign="center">
          <IconButton onClick={handleQuestionLike}>
            <ThumbUpIcon /> {likes}
          </IconButton>
          <IconButton onClick={handleQuestionDislike}>
            <ThumbDownIcon /> {dislikes}
          </IconButton>
        </Grid>
        {/* 설명 카드 */}
        {explanations.map((explanation, index) => (
          <Grid key={index} item xs={5}>
            <Card sx={{ maxWidth: 500 }} onClick={() => handleExplanationSelect(explanation)}>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="300"
                  image={"http://via.placeholder.com/200x150"}
                  alt="Explanation Image"
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
        {/* 선택하지 않고 진행하기 */}
        <Grid item xs={12} textAlign="center">
          <Button variant="contained" color="secondary" onClick={handleNoChoice}>
            선택하지 않고 진행
          </Button>
        </Grid>
        {/* 다음으로 진행하기 */}
        <Grid item xs={12} textAlign="center">
          <Button variant="contained" color="primary" onClick={handleNext} disabled={!selectedExplanation}>
            다음
          </Button>
        </Grid>
        {/* 댓글 입력 폼 */}
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
        {/* 댓글 목록 */}
        {comments[selectedExplanation] && comments[selectedExplanation].length > 0 && (
          <Grid item xs={12}>
            <Typography variant="h6">댓글</Typography>
            {comments[selectedExplanation].map((comment, index) => (
              <Comment
                key={index}
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
    </Container>
  );
}

function App() {
  const [currentQuestion, setCurrentQuestion] = useState(null);

  useEffect(() => {
    // 퀴즈 데이터를 가져오는 함수
    const fetchQuizData = async () => {
      try {
        const response = await axios.get('https://valanse.site/quiz/1', {
          headers: {
            'accept': 'application/json;charset=UTF-8',
            // 여기에 필요하다면 Authorization 헤더를 추가하세요
            // 'Authorization': `Bearer ${yourAccessToken}`
          }
        });
        setCurrentQuestion(response.data);
      } catch (error) {
        console.error('Error fetching quiz data:', error.message);
      }
    };

    fetchQuizData();
  }, []);

  const handleNext = (selectedExplanation) => {
    // 여기에 다음 문제로 넘어가는 로직을 추가하세요.
  };

  if (!currentQuestion) {
    return <div>Loading...</div>;
  }

  return (
    <QuestionPage
      question={currentQuestion.question}
      explanations={currentQuestion.explanations}
      onNext={handleNext}
    />
  );
}

export default App;
