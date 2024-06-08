import React, { useState } from 'react';
import { Button, Container, Grid, TextField, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';

function EditQuestionPage({ quizId }) {
    const [question, setQuestion] = useState('');
    const [descriptionA, setDescriptionA] = useState('');
    const [descriptionB, setDescriptionB] = useState('');
    const [imageA, setImageA] = useState(null);
    const [imageB, setImageB] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [openDialog, setOpenDialog] = useState(false);

    // 이미지 URL 상태 초기화
    const [imageUrlA, setImageUrlA] = useState('');
    const [imageUrlB, setImageUrlB] = useState('');

    // 기존 퀴즈 데이터 불러오기
    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                const response = await axios.get(`https://valanse.site/quiz/${quizId}`);
                const { content, descriptionA, descriptionB, category } = response.data;
                setQuestion(content);
                setDescriptionA(descriptionA);
                setDescriptionB(descriptionB);
                setSelectedCategory(category);
            } catch (error) {
                console.error('Error fetching quiz data:', error.response ? error.response.data : error.message);
            }
        };

        fetchQuizData();
    }, [quizId]);

    const handleEdit = async () => {
        const formData = new FormData();
        const editedQuizData = {
            content: question,
            descriptionA,
            descriptionB,
            category: selectedCategory
        };

        formData.append('quizData', new Blob([JSON.stringify(editedQuizData)], { type: 'application/json' }));
        if (imageA) formData.append('imageA', imageA);
        if (imageB) formData.append('imageB', imageB);

        try {
            const response = await axios.patch(`https://valanse.site/quiz/${quizId}/edit`, formData, {
                headers: {
                    'Authorization': Cookies.get('access_token'),
                    'Content-Type': 'multipart/form-data'
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
        <Container>
            <Grid container spacing={2}>
                {/* 퀴즈 수정 폼 */}
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="퀴즈 제목"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="왼쪽 설명"
                        value={descriptionA}
                        onChange={(e) => setDescriptionA(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                        fullWidth
                        label="오른쪽 설명"
                        value={descriptionB}
                        onChange={(e) => setDescriptionB(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6}>
                    {/* 이미지 A 업로드 */}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageA(e.target.files[0])}
                    />
                </Grid>
                <Grid item xs={6}>
                    {/* 이미지 B 업로드 */}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImageB(e.target.files[0])}
                    />
                </Grid>
                <Grid item xs={12}>
                    {/* 카테고리 선택 */}
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
                </Grid>
                <Grid item xs={12}>
                    {/* 수정 버튼 */}
                    <Button variant="contained" color="primary" onClick={handleEdit}>수정</Button>
                </Grid>
            </Grid>
            {/* 알림 다이얼로그 */}
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>알림</DialogTitle>
                <DialogContent>퀴즈가 수정되었습니다!</DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">확인</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default EditQuestionPage;
