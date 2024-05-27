import axios from 'axios';

const saveUserAnswer = async (answerData) => {
  try {
    const response = await axios.post('https://valanse.site/quiz/save-user-answer', answerData, {
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    console.log('User answer saved successfully:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error saving user answer:', error.message);
    throw error;
  }
};

export default saveUserAnswer;
