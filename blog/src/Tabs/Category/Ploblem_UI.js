import React, { useState } from 'react';
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, Container, Grid } from '@mui/material';
import Soccer_image from '../../layouts/img/SoccerImage.jpg';

function QuestionPage({ question, explanations, onNext }) {
  const [selectedExplanation, setSelectedExplanation] = useState(null);

  // 문제 설명을 업데이트
  const handleExplanationSelect = (explanation) => {
    setSelectedExplanation(explanation);
  };

  // 다음으로 진행
  const handleNext = () => {
    onNext(selectedExplanation);
    setSelectedExplanation(null); // 다음 문제를 위해 선택한 설명을 초기화합니다.
  };

  // 선택하지 않고 다음으로 진행합니다.
  const handleNoChoice = () => {
    onNext(null); // 선택하지 않은 것으로 처리합니다.
  };

  return (
    <Container maxWidth="lg">
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} style={{ height: '30px' }} />
        <Grid item xs={12}>
          <Typography variant="h4" align="center">{question}</Typography>
        </Grid>
        {/* 첫 번째 설명 카드 */}
        <Grid item xs={5}>
          <Card sx={{ maxWidth: 500 }} onClick={() => handleExplanationSelect(explanations[0])}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="300"
                image={"http://via.placeholder.com/200x150"}
                alt="Soccer Image"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {explanations[0]}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
        <Grid item xs={2} />
        {/* 두 번째 설명 카드 */}
        <Grid item xs={5}>
          <Card sx={{ maxWidth: 500 }} onClick={() => handleExplanationSelect(explanations[1])}>
            <CardActionArea>
              <CardMedia
                component="img"
                height="300"
                image={"http://via.placeholder.com/200x150"}
                alt="Soccer Image"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {explanations[1]}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
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
      category: "축구",
      explanations: ["반 페르시의 맨유 이적", "솔 캠벨의 아스날 이적"]
    },
    {
      question: "무인도에 떨어지면 무엇을 가지고 시작하고 싶은가요?",
      category: "생존",
      explanations: ["라이터", "텐트"]
    }
  ];

  // 다음 문제로 넘어갑니다.
  const handleNext = (selectedExplanation) => {
    setSelectedExplanations([...selectedExplanations, selectedExplanation]);
    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // 마지막 문제를 처리합니다.
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
