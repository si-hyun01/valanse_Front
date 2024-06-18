import React, { useState } from 'react';
import { Button, Container, Grid, TextField, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, Card } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import Cookies from 'js-cookie';

function CreateQuestionPage({ onCreate, selectedCategory }) {
    const [question, setQuestion] = useState('');
    const [story1, setStory1] = useState('');
    const [story2, setStory2] = useState('');
    const [story1Image, setStory1Image] = useState(null);
    const [story2Image, setStory2Image] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);

    // 이미지 URL 상태 초기화
    const [story1ImageUrl, setStory1ImageUrl] = useState('');
    const [story2ImageUrl, setStory2ImageUrl] = useState('');

    const resetForm = () => {
        setQuestion('');
        setStory1('');
        setStory2('');
        setStory1Image(null);
        setStory2Image(null);
        // 이미지 URL 상태 초기화
        setStory1ImageUrl('');
        setStory2ImageUrl('');
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
        } catch (error) {
            console.error('Error creating quiz:', error.response ? error.response.data : error.message);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    return (
        <Card style={{ border: '2px solid transparent', background: 'black', boxShadow: '0 0 10px #00FF00' }}>
            <Container>
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
                        <ImageUpload setImage={setStory1Image} setUploadImgUrl={setStory1ImageUrl} resetImageUrl={() => setStory1ImageUrl('')} />
                    </Grid>
                    <Grid item xs={6}>
                        <ImageUpload setImage={setStory2Image} setUploadImgUrl={setStory2ImageUrl} resetImageUrl={() => setStory2ImageUrl('')} />
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
        </Card>
    );
}

const ImageUpload = ({ setImage, setUploadImgUrl, resetImageUrl }) => {
    const [uploadImgUrl, setUploadImgUrlInternal] = useState('');

    const onchangeImageUpload = (e) => {
        const { files } = e.target;
        const uploadFile = files[0];
        setImage(uploadFile);
        const reader = new FileReader();
        reader.readAsDataURL(uploadFile);
        reader.onloadend = () => {
            setUploadImgUrlInternal(reader.result);
            // 이미지 URL 설정
            setUploadImgUrl(reader.result);
        };
    };

    const handleRemoveImage = () => {
        setImage(null);
        resetImageUrl(); // Reset the image URL
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
                        onChange={onchangeImageUpload}
                    />
                </Button>
                {uploadImgUrl && (
                    <Button variant="contained" color="secondary" onClick={handleRemoveImage} style={{ marginLeft: '10px' }}>
                        이미지 제거
                    </Button>
                )}
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
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'black' }}>
            <Container
                maxWidth="md"
                sx={{
                    border: '2px solid transparent',
                    boxShadow: '0 0 10px #00FF00, 0 0 20px #00FF00, 0 0 40px #00FF00',
                    borderRadius: '10px',
                    padding: '20px',
                    marginTop: '40px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Grid container spacing={2} justifyContent="center">
                    <Grid item xs={12} style={{ height: '30px' }} />
                    <Grid item xs={12}>
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
                    </Grid>
                </Grid>
                {selectedCategory && <CreateQuestionPage onCreate={handleCreateQuestion} selectedCategory={selectedCategory} />}
            </Container>
        </div>
    );
}

export default App;
