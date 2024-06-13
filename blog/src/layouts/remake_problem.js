import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';

function CreateQuestionDialog({ open, handleClose, quiz, handleCreate, onUpdateQuizzes }) {
    const [question, setQuestion] = useState('');
    const [optionA, setOptionA] = useState('');
    const [optionB, setOptionB] = useState('');
    const [descriptionA, setDescriptionA] = useState('');
    const [descriptionB, setDescriptionB] = useState('');
    const [imageA, setImageA] = useState(null);
    const [imageB, setImageB] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [fileAName, setFileAName] = useState('');
    const [fileBName, setFileBName] = useState('');

    useEffect(() => {
        if (quiz) {
            setQuestion(quiz.content || '');
            setOptionA(quiz.optionA || '');
            setOptionB(quiz.optionB || '');
            setDescriptionA(quiz.descriptionA || '');
            setDescriptionB(quiz.descriptionB || '');
            setSelectedCategory(quiz.category || '');
            setFileAName(quiz.imageA ? quiz.imageA.split('/').pop() : '');
            setFileBName(quiz.imageB ? quiz.imageB.split('/').pop() : '');
        }
    }, [quiz]);

    const handleCreateQuestion = async () => {
        const quizRegisterDto = {
            content: question,
            optionA: optionA,
            optionB: optionB,
            descriptionA: descriptionA,
            descriptionB: descriptionB,
            category: selectedCategory ? [selectedCategory] : []
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
            handleClose();
            handleCreate();
            onUpdateQuizzes();
        } catch (error) {
            console.error('퀴즈 수정 오류:', error.response ? error.response.data : error.message);
        }
    };

    const handleImageChange = (setImageFunc, setFileNameFunc, currentImage) => (e) => {
        setImageFunc(e.target.files[0]);
        setFileNameFunc(e.target.files[0].name);
    };

    // 이미지를 고정 크기로 표시하는 스타일 설정
    const imagePreviewStyle = {
        maxWidth: '100%',
        height: 'auto',
        maxHeight: 200, // 원하는 높이로 설정
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md">
            <DialogTitle>퀴즈 수정</DialogTitle>
            <DialogContent>
                <FormControl fullWidth style={{ marginBottom: '30px', marginTop: '20px' }}>
                    <InputLabel>카테고리 선택</InputLabel>
                    <Select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
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

                {selectedCategory && (
                    <>
                        <TextField
                            fullWidth
                            label="퀴즈 제목"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            style={{ marginBottom: '20px' }}
                        />
                        <TextField
                            fullWidth
                            label="왼쪽 설명"
                            value={descriptionA}
                            onChange={(e) => setDescriptionA(e.target.value)}
                            style={{ marginBottom: '20px' }}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange(setImageA, setFileAName, quiz.imageA)}
                            style={{ marginBottom: '20px' }}
                        />
                        {fileAName && (
                            <div>
                                <img src={URL.createObjectURL(imageA)} alt="이미지 A" style={imagePreviewStyle} />
                                <div>{fileAName}</div>
                            </div>
                        )}
                        <TextField
                            fullWidth
                            label="오른쪽 설명"
                            value={descriptionB}
                            onChange={(e) => setDescriptionB(e.target.value)}
                            style={{ marginBottom: '20px' }}
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange(setImageB, setFileBName, quiz.imageB)}
                            style={{ marginBottom: '20px' }}
                        />
                        {fileBName && (
                            <div>
                                <img src={URL.createObjectURL(imageB)} alt="이미지 B" style={imagePreviewStyle} />
                                <div>{fileBName}</div>
                            </div>
                        )}
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>취소</Button>
                <Button onClick={handleCreateQuestion} variant="contained" color="primary">수정</Button>
            </DialogActions>
        </Dialog>
    );
}

export default CreateQuestionDialog;
