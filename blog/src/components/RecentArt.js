import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

const MyQuizzesPage = () => {
  const [quizzes, setQuizzes] = useState([]);

  // 서버에서 퀴즈 데이터를 가져오는 함수
  const fetchQuizzes = async () => {
    try {
      const accessToken = Cookies.get('access_token'); // 쿠키에서 액세스 토큰 가져오기
      const response = await axios.get('https://valanse.site/quiz/sorted-by-created-at', {
        headers: {
          'Authorization': accessToken // 헤더에 액세스 토큰 추가
        }
      });
      setQuizzes(response.data.data); // 가져온 데이터의 data 필드를 상태에 저장
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  // 컴포넌트가 마운트될 때 퀴즈 데이터를 가져옴
  useEffect(() => {
    fetchQuizzes();
  }, []);

  return (
    <div style={{ marginTop: '20px', color: 'white' }}>
      <h2 style={{ color: 'white' }}>최근 작품</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {/* 상태에 저장된 퀴즈 데이터를 순회하며 사진과 제목을 표시 */}
        {quizzes.map((quiz, index) => (
          <div key={index} style={{ width: 'calc(33.33% - 20px)', margin: '10px', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
            <img src={quiz.imageA} alt={quiz.content} style={{ width: '100%', height: 'auto' }} /> {/* 퀴즈의 imageA를 가져옴 */}
            <h3 style={{ marginTop: '10px', marginBottom: '5px', color: 'white' }}>{quiz.content}</h3> {/* 퀴즈의 content를 가져옴 */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyQuizzesPage;
