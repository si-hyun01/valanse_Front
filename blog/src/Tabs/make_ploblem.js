import React, { useState } from 'react';
import { Button, Container, Grid, TextField, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import Cookies from 'js-cookie';
import saveUserAnswer from "../components/comments";

function CreateQuestionPage({ onCreate, selectedCategory }) {
    const [question, setQuestion] = useState('');
    const [story1, setStory1] = useState('');
    const [story2, setStory2] = useState('');
    const [story1Image, setStory1Image] = useState(null);
    const [story2Image, setStory2Image] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    const resetForm = () => {
        setQuestion('');
        setStory1('');
        setStory2('');
        setStory1Image(null);
        setStory2Image(null);
    };
    
    const handleCreate = async () => {
        const formData = new FormData();
        const quizRegisterDto = {
            content: question,
            optionA: story1,
            optionB: story2,
            descriptionA: story1,
            descriptionB: story2,
            category: [selectedCategory]
        };
    
        formData.append('quizRegisterDto', new Blob([JSON.stringify(quizRegisterDto)], { type: 'application/json' }));
        formData.append('image_A', story1Image);
        formData.append('image_B', story2Image);
    
        try {
            const response = await axios.post('https://valanse.site/quiz/register', formData, {
                headers: {
                    'Authorization': Cookies.get('access_token'),
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log('Quiz created successfully:', response.data);
            setOpenDialog(true);
            resetForm(); // Reset the form after successful creation
            // 이미지 초기화
            setStory1Image(null);
            setStory2Image(null);
        } catch (error) {
            console.error('Error creating quiz:', error.response ? error.response.data : error.message);
        }
    };    

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <Container maxWidth="md">
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} style={{ height: '30px' }} />
                <Grid item xs={12}>
                    <TextField
                    style={{ backgroundColor: 'gray' }} 
                        label="문제 제목을 작성해주세요"
                        fullWidth
                        multiline
                        rows={4}
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                    style={{ backgroundColor: 'gray' }}
                        label="아래 사진과 함께 상황을 설명해주세요"
                        fullWidth
                        multiline
                        rows={4}
                        value={story1}
                        onChange={(e) => setStory1(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <TextField
                    style={{ backgroundColor: 'gray' }}
                        label="아래 사진과 함께 상황을 설명해주세요"
                        fullWidth
                        multiline
                        rows={4}
                        value={story2}
                        onChange={(e) => setStory2(e.target.value)}
                    />
                </Grid>
                <Grid item xs={6}>
                    <ImageUpload setImage={setStory1Image} />
                </Grid>
                <Grid item xs={6}>
                    <ImageUpload setImage={setStory2Image} />
                </Grid>
                <Grid item xs={12} style={{ height: '30px' }} />
                <Grid item xs={12} textAlign="center">
                    <Button variant="contained" color="success" onClick={handleCreate}>
                        문제 생성
                    </Button>
                </Grid>
                <Grid item xs={12} style={{ height: '30px' }} />
            </Grid>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>알림</DialogTitle>
                <DialogContent>
                    문제가 생성되었습니다!
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="primary">
                        확인
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

const ImageUpload = ({ setImage }) => {
    const [uploadImgUrl, setUploadImgUrl] = useState('');

    const onchangeImageUpload = (e) => {
        const { files } = e.target;
        const uploadFile = files[0];
        setImage(uploadFile);
        const reader = new FileReader();
        reader.readAsDataURL(uploadFile);
        reader.onloadend = () => {
            setUploadImgUrl(reader.result);
        };
    };

    // 이미지 URL 상태 초기화 함수
    const resetImage = () => {
        setUploadImgUrl('');
    };

    return (
        <Grid container alignItems="center" justifyContent="space-around">
            <Grid item>
                <img src={uploadImgUrl || "https://via.placeholder.com/200x150"} alt="사진 업로드 해주세요" style={{ width: '200px', height: '150px' }} />
            </Grid>
            <Grid item>
                <Button variant="contained" color="primary" component="label" startIcon={<CloudUploadIcon />}>
                    이미지 선택
                    <input
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                            onchangeImageUpload(e);
                            resetImage(); // 이미지 선택 후에 이미지 URL 초기화
                        }}
                    />
                </Button>
            </Grid>
        </Grid>
    );
};


function App() {
    const [selectedCategory, setSelectedCategory] = useState('');

    const handleCreateQuestion = (newQuestion) => {
        console.log('New question created:', newQuestion);
    };

    const handleCategoryChange = (event) => {
        setSelectedCategory(event.target.value);
    };

    return (
        <div>
            <Container maxWidth="md">
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} style={{ height: '30px' }} />
                    <Grid item xs={12}>
                        <FormControl fullWidth style={{ backgroundColor: 'gray' }}>
                        <InputLabel style={{ color: 'white' }}>카테고리 선택</InputLabel>
                            <Select
                                value={selectedCategory}
                                onChange={handleCategoryChange}
                                label="카테고리 선택"
                            >
                                {/* 메뉴 아이템들은 기본적으로 흰색 배경을 가지고 있으므로 수정이 필요하지 않습니다. */}
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
                </Grid>
                {selectedCategory && <CreateQuestionPage onCreate={handleCreateQuestion} selectedCategory={selectedCategory} />}
            </Container>
        </div>
    );
}

export default App;
