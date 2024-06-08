import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';

function EditQuestionPage({ quizId }) {
    const [question, setQuestion] = useState('');
    const [descriptionA, setDescriptionA] = useState('');
    const [descriptionB, setDescriptionB] = useState('');
    const [imageA, setImageA] = useState('');
    const [imageB, setImageB] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [openDialog, setOpenDialog] = useState(false);

    const handleEdit = async () => {
        const editedQuizData = {
            quizRegisterDto: {
                content: question,
                optionA: descriptionA,
                optionB: descriptionB,
                descriptionA: descriptionA,
                descriptionB: descriptionB,
                category: [selectedCategory]
            },
            image_A: imageA,
            image_B: imageB
        };

        try {
            const response = await axios.patch(`https://valanse.site/quiz/${quizId}`, editedQuizData, {
                headers: {
                    'Authorization': Cookies.get('access_token'),
                    'Content-Type': 'application/json'
                }
            });
            console.log('Quiz edited successfully:', response.data);
            setOpenDialog(true);
        } catch (error) {
            console.error('Error editing quiz:', error.response ? error.response.data : error.message);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <Dialog open={openDialog} onClose={handleCloseDialog}>
            <DialogTitle>퀴즈 수정</DialogTitle>
            <DialogContent>
                <FormControl fullWidth>
                    <InputLabel>퀴즈 제목</InputLabel>
                    <Select
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    >
                        <MenuItem value="퀴즈 제목">{question}</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel>왼쪽 설명</InputLabel>
                    <Select
                        value={descriptionA}
                        onChange={(e) => setDescriptionA(e.target.value)}
                    >
                        <MenuItem value="왼쪽 설명">{descriptionA}</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel>오른쪽 설명</InputLabel>
                    <Select
                        value={descriptionB}
                        onChange={(e) => setDescriptionB(e.target.value)}
                    >
                        <MenuItem value="오른쪽 설명">{descriptionB}</MenuItem>
                    </Select>
                </FormControl>
                <FormControl fullWidth>
                    <InputLabel>카테고리 선택</InputLabel>
                    <Select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
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
                <Button onClick={handleCloseDialog} color="primary">확인</Button>
            </DialogActions>
        </Dialog>
    );
}

export default EditQuestionPage;
