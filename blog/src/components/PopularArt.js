import React from 'react';

const MyQuizzesPage = () => {
  // 퀴즈 정보 예시
  const quizzes = [
    { title: '퀴즈 제목 1', image: '/path/to/image1.jpg' },
    { title: '퀴즈 제목 2', image: '/path/to/image2.jpg' },
    { title: '퀴즈 제목 3', image: '/path/to/image3.jpg' },
    // 추가적인 퀴즈 정보들...
  ];

  return (
    <div style={{ marginTop: '20px', color: 'white' }}> {/* 전체 텍스트를 하얀색으로 변경 */}
      <h2 style={{ color: 'white' }}>인기 작품</h2> {/* 제목 텍스트를 하얀색으로 변경 */}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {/* 퀴즈 목록을 순회하며 사진과 제목을 표시 */}
        {quizzes.map((quiz, index) => (
          <div key={index} style={{ width: 'calc(33.33% - 20px)', margin: '10px', border: '1px solid #ccc', borderRadius: '5px', padding: '10px' }}>
            <img src={quiz.image} alt={quiz.title} style={{ width: '100%', height: 'auto' }} />
            <h3 style={{ marginTop: '10px', marginBottom: '5px', color: 'white' }}>{quiz.title}</h3> {/* 각 퀴즈 제목을 하얀색으로 변경 */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyQuizzesPage;
