import React, { useState } from 'react';
import { Button, Container, Grid, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function CreateQuestionPage({ onCreate, selectedCategory }) {
    const [question, setQuestion] = useState('');
    const [story1, setStory1] = useState('');
    const [story2, setStory2] = useState('');
    const [story1Image, setStory1Image] = useState('');
    const [story2Image, setStory2Image] = useState('');
    const [openDialog, setOpenDialog] = useState(false);

    const handleCreate = () => {
        onCreate({
            category: selectedCategory,
            question,
            options: [
                { text: story1, image: story1Image },
                { text: story2, image: story2Image }
            ]
        });
        setQuestion('');
        setStory1('');
        setStory2('');
        setStory1Image('');
        setStory2Image('');
        setOpenDialog(true); // 다이얼로그 표시
    };

    const handleCloseDialog = () => {
        setOpenDialog(false); // 다이얼로그 닫기
    };

    return (
        <Container maxWidth="md">
            <Grid container spacing={2} justifyContent="center">
                <Grid item xs={12} style={{ height: '30px' }} />
                <Grid item xs={12}>
                    <TextField
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
        const reader = new FileReader();
        reader.readAsDataURL(uploadFile);
        reader.onloadend = () => {
            setUploadImgUrl(reader.result);
            setImage(reader.result);
        };
    };

    return (
        <Grid container alignItems="center" justifyContent="space-around">
            <Grid item>
                <img src={uploadImgUrl || "http://via.placeholder.com/200x150"} alt="사진 업로드 해주세요" style={{ width: '200px', height: '150px' }} />
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
                        <FormControl fullWidth>
                            <InputLabel>카테고리 선택</InputLabel>
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
