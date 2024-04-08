import React, { useState } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // useHistory 대신 useNavigate 사용
import Header from '../layouts/Header';
import Footer from '../layouts/Footer';
import './notii.css';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const NoticeWrite = () => {
    const [newNotice, setNewNotice] = useState('');
    const [newNoticeContent, setNewNoticeContent] = useState('');
    const navigate = useNavigate(); // useHistory 대신 useNavigate 사용

    const handleAddNotice = () => {
        if (newNotice.trim() !== '' && newNoticeContent.trim() !== '') {
            // 공지 작성 후 원래 홈페이지로 이동
            navigate('/');
        }
    };

    return (
        <>
            <Header />
            <Container maxWidth="md" className="notii">
                <Typography variant="h4" className="notii-title2">
                    공지게시판
                </Typography>
                <Button variant="contained" className="button1_write" style={{ backgroundColor: 'white', boxShadow: 'none' }} onClick={() => navigate(-1)} >
                    <ArrowBackIcon style={{ color: 'black', fontSize: '24px' }} />
                    <span style={{ color: 'black', fontWeight: 'bold', fontSize: '20px' }}>뒤로가기</span>
                </Button>
                <div className="textfield1">
                    <TextField
                        label="제목"
                        fullWidth
                        value={newNotice}
                        onChange={(e) => setNewNotice(e.target.value)}
                        variant="outlined"
                    />
                </div>
                <div className="textfield2">
                    <TextField
                        label="내용"
                        fullWidth
                        multiline
                        rows={12}
                        value={newNoticeContent}
                        onChange={(e) => setNewNoticeContent(e.target.value)}
                        variant="outlined"
                    />
                </div>
                <Button variant="contained" className="notii-button2" color="primary" onClick={handleAddNotice}>
                    작성
                </Button>
            </Container>
            <Footer />
        </>
    );
};

export default NoticeWrite;
