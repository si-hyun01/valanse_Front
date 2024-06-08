import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';

function EditQuestionDialog({ open, handleClose, quiz, handleEdit, selectedCategory, handleCategoryChange }) {
    const [editedQuestion, setEditedQuestion] = useState(quiz?.content || '');
    const [editedOptionA, setEditedOptionA] = useState(quiz && quiz.optionA ? quiz.optionA : '');
    const [editedOptionB, setEditedOptionB] = useState(quiz && quiz.optionB ? quiz.optionB : '');
    const [editedDescriptionA, setEditedDescriptionA] = useState(quiz && quiz.descriptionA ? quiz.descriptionA : '');
    const [editedDescriptionB, setEditedDescriptionB] = useState(quiz && quiz.descriptionB ? quiz.descriptionB : '');
    const [editedImageA, setEditedImageA] = useState(null); // 이미지 A 상태
    const [editedImageB, setEditedImageB] = useState(null); // 이미지 B 상태

    const handleEditQuestion = async () => {
        const editedQuiz = {
            quizRegisterDto: {
                content: editedQuestion,
                optionA: editedOptionA,
                optionB: editedOptionB,
                descriptionA: editedDescriptionA,
                descriptionB: editedDescriptionB,
                category: [selectedCategory]
            }
        };

        try {
            // 이미지 파일도 FormData에 추가
            const formData = new FormData();
            formData.append('quiz', JSON.stringify(editedQuiz));
            if (editedImageA) formData.append('imageA', editedImageA);
            if (editedImageB) formData.append('imageB', editedImageB);

            await axios.patch(`https://valanse.site/quiz/${quiz.quizId}`, formData, {
                headers: {
                    'Authorization': Cookies.get('access_token'),
                    'Content-Type': 'multipart/form-data'
                }
            });
            handleEdit(editedQuiz);
            handleClose();
        } catch (error) {
            console.error('Error editing quiz:', error.response ? error.response.data : error.message);
        }
    };

    const handleImageChange = (setImageFunc) => (e) => {
        setImageFunc(e.target.files[0]);
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
                    label="왼쪽 설명"
                    value={editedDescriptionA}
                    onChange={(e) => setEditedDescriptionA(e.target.value)}
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange(setEditedImageA)}
                />
                <TextField
                    fullWidth
                    label="오른쪽 설명"
                    value={editedDescriptionB}
                    onChange={(e) => setEditedDescriptionB(e.target.value)}
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange(setEditedImageB)}
                />

                {/* 카테고리 선택 */}
                <FormControl fullWidth style={{ backgroundColor: 'gray', marginBottom: '30px' }}>
                    <InputLabel style={{ color: 'white' }}>카테고리 선택</InputLabel>
                    <Select
                        value={selectedCategory}
                        onChange={handleCategoryChange}
                        label="카테고리 선택"
                    >
                        <MenuItem value="축구">축구</MenuItem>
                        <MenuItem value="음식">음식</MenuItem>
                        <MenuItem value="연애">연애</MenuItem>
                        <MenuItem value="노래">노래</MenuItem>
                        <MenuItem value="생존">생존</MenuItem>
                        <MenuItem value="드라마&영화">드라마&영화</MenuItem>
                        <MenuItem value="일상">일상</MenuItem>
                    </Select>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>취소</Button>
                <Button onClick={handleEditQuestion} variant="contained" color="primary">수정</Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditQuestionDialog;
