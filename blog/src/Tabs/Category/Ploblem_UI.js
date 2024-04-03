import React, { useState } from 'react';
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
  const [isNextOverlayVisible, setNextOverlayVisible] = useState(false); // 다음으로 진행하는 검은색 막 상태 추가


  // 문제 설명을 업데이트
  const handleExplanationSelect = (explanation) => {
    setSelectedExplanation(explanation);
    setNextOverlayVisible(true); // 다음으로 진행하는 검은색 막 표시
    setComments({});// 다른 문제를 선택할 때마다 댓글을 초기화
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
    setNextOverlayVisible(false); // 검은색 막 숨기기
  };

  // 선택하지 않고 다음으로 진행합니다.
  const handleNoChoice = () => {
    onNext(null); // 선택하지 않은 것으로 처리합니다.
    setComments({}); // 댓글을 초기화합니다.
    setCommentText(''); // 댓글 입력 필드 비우기
    setNextOverlayVisible(false); // 검은색 막 숨기기
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
                  alt="Soccer Image"
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {explanation}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
            {/* 문제 선택시 나타나는 검은색 창*/}
            {selectedExplanation === explanation && isNextOverlayVisible && (
              <div
                style={{
                  position: 'absolute',
                  top: '60%', // 막이 위에서부터 아래까지 나타나는 위치설정
                  left: '50%', // 막이 왼쪽에서부터 중간에 위치하도록 설정
                  transform: 'translate(-50%, -50%)', // 막을 수직 및 수평으로 중앙에 위치하도록 설정
                  width: '80%', // 검은색 막 너비 80% 크기로 설정
                  height: '75%', // 검은색 막 높이 70% 크기로 설정
                  backgroundColor: 'rgba(0, 0, 0, 0.8)',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white',
                  fontSize: '24px',
                  zIndex: 9999, // 다른 요소들보다 위에 오도록 설정
                }}
                onClick={handleNext} // 검은색 막 클릭 시 다음으로 진행
              >
                다음으로 넘어갈려면 이 검은색 화면을 클릭하시오
              </div>
            )}
          </Grid>
        ))}
        {/* 선택하지 않고 진행하기 */}
        <Grid item xs={12} textAlign="center">
          <Button variant="contained" color="secondary" onClick={handleNoChoice}>
            선택하지 않고 진행
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
