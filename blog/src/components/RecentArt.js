import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const MyQuizzesPage = () => {
  const [recentQuizzes, setRecentQuizzes] = useState([null, null, null]); // 초기 상태를 null로 설정

  const fetchRecentQuizzes = async () => {
    try {
      const accessToken = Cookies.get('access_token');
      const response = await axios.get('https://valanse.site/quiz/sort-by-created-at', {
        headers: {
          'Authorization': accessToken 
        }
      });
      console.log('Response Data:', response.data.data);
      const recentQuizzesData = response.data.data.slice(0, 3);
      setRecentQuizzes(recentQuizzesData);
    } catch (error) {
      console.error('Error fetching recent quizzes:', error);
    }
  };

  useEffect(() => {
    fetchRecentQuizzes();
  }, []);

  return (
    <div style={{ marginTop: '20px', color: 'white' }}>
      <h2 style={{ marginBottom: '10px', color: 'white', fontWeight: 'bold' }}>최근 작품</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {recentQuizzes.map((quiz, index) => (
          <div key={index} style={{ width: 'calc(33.33% - 20px)', margin: '10px', border: '1px solid #ccc', borderRadius: '5px', padding: '10px', overflow: 'hidden' }}>
            {quiz && quiz.imageA ? (
              <img src={quiz.imageA} alt={quiz.content} style={{ width: '100%', height: '250px', objectFit: 'cover' }} />
            ) : (
              <div style={{ width: '100%', height: '250px', backgroundColor: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#333' }}>
                No Image Available
              </div> 
            )}
            <h3 style={{ marginTop: '10px', marginBottom: '5px', color: 'white' }}>{quiz ? quiz.content : '로딩 중...'}</h3> 
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyQuizzesPage;
