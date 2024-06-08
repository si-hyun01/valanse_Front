import React, { useState } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';

function CreateQuestionDialog({ open, handleClose, quiz, handleCreate, selectedCategory, handleCategoryChange }) {
    const [question, setQuestion] = useState(quiz?.content || '');
    const [optionA, setOptionA] = useState(quiz && quiz.optionA ? quiz.optionA : '');
    const [optionB, setOptionB] = useState(quiz && quiz.optionB ? quiz.optionB : '');
    const [descriptionA, setDescriptionA] = useState(quiz && quiz.descriptionA ? quiz.descriptionA : '');
    const [descriptionB, setDescriptionB] = useState(quiz && quiz.descriptionB ? quiz.descriptionB : '');
    const [imageA, setImageA] = useState(null);
    const [imageB, setImageB] = useState(null);

    const handleCreateQuestion = async () => {
        const quizRegisterDto = {
            content: question,
            optionA: optionA,
            optionB: optionB,
            descriptionA: descriptionA,
            descriptionB: descriptionB,
            category: selectedCategory
        };

        const formData = new FormData();
        formData.append('quizRegisterDto', new Blob([JSON.stringify(quizRegisterDto)], { type: 'application/json' }));
        if (imageA) formData.append('image_A', imageA);
        if (imageB) formData.append('image_B', imageB);

        try {
            const response = await axios.patch(`https://valanse.site/quiz/${quiz.quizId}`, formData, {
                headers: {
                    'Authorization': Cookies.get('access_token'),
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Quiz updated successfully:', response.data);
            handleCreate();
            handleClose();
        } catch (error) {
            console.error('Error updating quiz:', error.response ? error.response.data : error.message);
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
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
                <TextField
                    fullWidth
                    label="왼쪽 설명"
                    value={descriptionA}
                    onChange={(e) => setDescriptionA(e.target.value)}
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange(setImageA)}
                />
                <TextField
                    fullWidth
                    label="오른쪽 설명"
                    value={descriptionB}
                    onChange={(e) => setDescriptionB(e.target.value)}
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange(setImageB)}
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
                <Button onClick={handleCreateQuestion} variant="contained" color="primary">수정</Button>
            </DialogActions>
        </Dialog>
    );
}

export default CreateQuestionDialog;
