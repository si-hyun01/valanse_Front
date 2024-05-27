import axios from 'axios';

const saveUserAnswer = async (answerData) => {
  try {
    const response = await axios.post(
      'https://valanse.site/quiz/save-user-answer',
      answerData,
      {
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('User answer saved successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error saving user answer:', error.message);
    throw error;
  }
};

// 사용 예시
const answerData = {
  userAnswerDto: {
    answerId: 0,
    userId: 0, // 사용자의 ID를 여기에 넣어주세요.
    quizId: 0, // 퀴즈의 ID를 여기에 넣어주세요.
    selectedOption: "string",
    answeredAt: new Date().toISOString(),
    timeSpent: 0,
    preference: 0,
    difficultyLevel: 0
  }
};

saveUserAnswer(answerData);
