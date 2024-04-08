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
  DialogTitle,
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
  const [isDialogOpen, setDialogOpen] = useState(false); // 다이얼로그 열림 상태 추가
  const [selectedChoice, setSelectedChoice] = useState(null); // 선택된 선택지 상태 추가


  // 문제 설명을 업데이트
  const handleExplanationSelect = (explanation) => {
    setSelectedExplanation(explanation);
    setDialogOpen(true); // 다이얼로그 열기
    setComments({});// 다른 문제를 선택할 때마다 댓글을 초기화
    setCommentText(''); // 댓글 입력 필드 비우기
  };

  // 선택한 선택지를 처리
  const handleConfirmation = (choice) => {
    if (choice === 'yes') {
      // 선택한 선택지를 처리하는 작업 수행
      onNext(selectedExplanation);
    }
    // 다이얼로그 닫기
    setDialogOpen(false);
    // 선택된 선택지 초기화
    setSelectedChoice(null);
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

  // 선택지를 선택하면 다이얼로그를 열고 선택한 선택지를 저장
  const handleChoiceSelect = (explanation) => {
    setSelectedExplanation(explanation);
    setDialogOpen(true);
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
            <Card sx={{ maxWidth: 500 }} onClick={() => handleChoiceSelect(explanation)}>
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
        {/* 다이얼로그 */}
        <Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>선택 확인</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              정말 이 선택지를 선택하시겠습니까?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => handleConfirmation('no')} color="primary">
              아니오
            </Button>
            <Button onClick={() => handleConfirmation('yes')} color="primary">
              예
            </Button>
          </DialogActions>
        </Dialog>
      </Grid>
    </Container>
  );
}

function App() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedExplanations, setSelectedExplanations] = useState([]);

  // 문제 리스트
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

  // 다음 문제로 넘어갑니다
  const handleNext = (selectedExplanation) => {
    setSelectedExplanations([...selectedExplanations, selectedExplanation]);
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // 마지막 문제를 처리합니다
    }
  };

  // 문제가 없는 경우 나타나는 문구
  if (questions.length === 0) {
    return <div>문제가 없습니다</div>;
  }

  // 현재 진행 중인 문제 페이지를 렌더링하는 거
  return (
    <QuestionPage
      question={questions[currentQuestionIndex].question}
      explanations={questions[currentQuestionIndex].explanations}
      onNext={handleNext}
    />
  );
}

export default App;
