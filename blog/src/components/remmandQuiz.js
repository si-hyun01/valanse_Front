import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const RecommendedQuizzesPage = () => {
  const [recommendedQuizzes, setRecommendedQuizzes] = useState([]);

  const fetchRecommendedQuizzes = async () => {
    try {
      const accessToken = Cookies.get('access_token'); 
      const response = await axios.get('https://valanse.site/quiz/recommend', {
        headers: {
          'Authorization': accessToken 
        }
      });
      setRecommendedQuizzes(response.data.data);
    } catch (error) {
      console.error('Error fetching recommended quizzes:', error);
    }
  };

  useEffect(() => {
    fetchRecommendedQuizzes();
  }, []);

  return (
    <div style={{ marginTop: '20px', color: 'white' }}>
      <h2 style={{ marginBottom: '10px', color: 'white', fontWeight: 'bold' }}>추천 퀴즈</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {recommendedQuizzes.map((quiz, index) => (
          <div key={index} style={{ width: 'calc(33.33% - 20px)', margin: '10px', border: '1px solid #ccc', borderRadius: '5px', padding: '10px', overflow: 'hidden' }}>
            {quiz.imageA ? (
              <img src={quiz.imageA} alt={quiz.content} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '250px', backgroundColor: '#ddd' }}></div> // 빈 사진
            )}
            <h3 style={{ marginTop: '10px', marginBottom: '5px', color: 'white' }}>{quiz.content || '로그인 하셈'}</h3> 
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecommendedQuizzesPage;
