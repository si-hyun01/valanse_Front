import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';

function EditQuestionDialog({ open, handleClose, quiz, handleEdit }) {
    const [editedQuestion, setEditedQuestion] = useState(quiz?.content || '');
    const [editedOptionA, setEditedOptionA] = useState(quiz && quiz.optionA ? quiz.optionA : '');
    const [editedOptionB, setEditedOptionB] = useState(quiz && quiz.optionB ? quiz.optionB : '');
    const [editedDescriptionA, setEditedDescriptionA] = useState(quiz && quiz.descriptionA ? quiz.descriptionA : '');
    const [editedDescriptionB, setEditedDescriptionB] = useState(quiz && quiz.descriptionB ? quiz.descriptionB : '');

    const handleEditQuestion = async () => {
        const editedQuiz = {
            ...quiz,
            content: editedQuestion,
            optionA: editedOptionA,
            optionB: editedOptionB,
            descriptionA: editedDescriptionA,
            descriptionB: editedDescriptionB
        };

        try {
            await axios.patch(`https://valanse.site/quiz/${quiz.quizId}`, editedQuiz, {
                headers: {
                    'Authorization': Cookies.get('access_token'),
                    'Content-Type': 'application/json'
                }
            });
            handleEdit(editedQuiz);
            handleClose();
        } catch (error) {
            console.error('Error editing quiz:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>퀴즈 수정</DialogTitle>
            <DialogContent>
                <TextField
                    fullWidth
                    label="퀴즈 제목"
                    value={editedQuestion}
                    onChange={(e) => setEditedQuestion(e.target.value)}
                />
                <TextField
                    fullWidth
                    label="옵션 A"
                    value={editedOptionA}
                    onChange={(e) => setEditedOptionA(e.target.value)}
                />
                <TextField
                    fullWidth
                    label="옵션 A 설명"
                    value={editedDescriptionA}
                    onChange={(e) => setEditedDescriptionA(e.target.value)}
                />
                <TextField
                    fullWidth
                    label="옵션 B"
                    value={editedOptionB}
                    onChange={(e) => setEditedOptionB(e.target.value)}
                />
                <TextField
                    fullWidth
                    label="옵션 B 설명"
                    value={editedDescriptionB}
                    onChange={(e) => setEditedDescriptionB(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>취소</Button>
                <Button onClick={handleEditQuestion} variant="contained" color="primary">수정</Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditQuestionDialog;
