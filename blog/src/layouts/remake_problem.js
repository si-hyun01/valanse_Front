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
    const [previewImageA, setPreviewImageA] = useState(null); // State for preview image A
    const [previewImageB, setPreviewImageB] = useState(null); // State for preview image B

    useEffect(() => {
        if (quiz) {
            setQuestion(quiz.content || '');
            setOptionA(quiz.optionA || '');
            setOptionB(quiz.optionB || '');
            setDescriptionA(quiz.descriptionA || '');
            setDescriptionB(quiz.descriptionB || '');
            setSelectedCategory(quiz.category || '');

            // Set file names for display
            setFileAName(quiz.imageA ? quiz.imageA.split('/').pop() : '');
            setFileBName(quiz.imageB ? quiz.imageB.split('/').pop() : '');

            // Set preview images if available
            if (quiz.imageA) setPreviewImageA(quiz.imageA);
            if (quiz.imageB) setPreviewImageB(quiz.imageB);
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
        // Check if new images are selected, otherwise append existing images
        if (imageA) formData.append('image_A', imageA);
        else if (quiz.imageA) formData.append('image_A', quiz.imageA);

        if (imageB) formData.append('image_B', imageB);
        else if (quiz.imageB) formData.append('image_B', quiz.imageB);

        try {
            const response = await axios.patch(`https://valanse.site/quiz/${quiz.quizId}`, formData, {
                headers: {
                    'Authorization': Cookies.get('access_token'),
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Quiz updated successfully:', response.data);
            handleClose(); // Close dialog
            handleCreate(); // Trigger handleCreate function if needed
            onUpdateQuizzes(); // Refresh quizzes list
        } catch (error) {
            console.error('퀴즈 수정 오류:', error.response ? error.response.data : error.message);
        }
    };

    const handleImageChange = (setImageFunc, setFileNameFunc, setPreviewFunc) => (e) => {
        const file = e.target.files[0];
        setImageFunc(file);
        setFileNameFunc(file.name); // Set file name for display
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewFunc(reader.result); // Set preview image
        };
        if (file) {
            reader.readAsDataURL(file);
        }
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
                        <div style={{ marginTop: '10px', color: 'gray', fontSize: '15px' }}>
                            이미지는 다시 업로드해야 수정이 가능합니다.
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange(setImageA, setFileAName, setPreviewImageA)}
                            style={{ marginBottom: '20px' }}
                        />
                        {previewImageA && <img src={previewImageA} alt="Preview A" style={{ width: '200px', height: '150px', objectFit: 'cover', marginBottom: '20px' }} />}
                        <TextField
                            fullWidth
                            label="오른쪽 설명"
                            value={descriptionB}
                            onChange={(e) => setDescriptionB(e.target.value)}
                            style={{ marginBottom: '20px' }}
                        />
                        <div style={{ marginTop: '10px', color: 'gray', fontSize: '15px' }}>
                            이미지는 다시 업로드해야 수정이 가능합니다.
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange(setImageB, setFileBName, setPreviewImageB)}
                            style={{ marginBottom: '20px' }}
                        />
                        {previewImageB && <img src={previewImageB} alt="Preview B" style={{ width: '200px', height: '150px', objectFit: 'cover', marginBottom: '20px' }} />}
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
