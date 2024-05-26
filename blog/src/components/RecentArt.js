import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyQuizzesPage = () => {
  const [quizzes, setQuizzes] = useState([]);

  // 서버에서 퀴즈 데이터를 가져오는 함수
  const fetchQuizzes = async () => {
    try {
      const response = await axios.get('https://valanse.site/quiz/sort-by-created-at');
      setQuizzes(response.data); // 가져온 데이터를 상태에 저장
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
            <img src={quiz.image} alt={quiz.title} style={{ width: '100%', height: 'auto' }} />
            <h3 style={{ marginTop: '10px', marginBottom: '5px', color: 'white' }}>{quiz.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyQuizzesPage;
