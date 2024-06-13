import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import axios from 'axios';
import Cookies from 'js-cookie';

const NoticeWrite = () => {
    const [newNotice, setNewNotice] = useState('');
    const [newNoticeContent, setNewNoticeContent] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogContent, setDialogContent] = useState('');
    const navigate = useNavigate();

    const handleDialogClose = () => {
        setDialogOpen(false);
        navigate('/'); // 다이얼로그가 닫힐 때 페이지 이동 실행
    };

    const handleAddNotice = async () => {
        if (newNotice.trim() !== '' && newNoticeContent.trim() !== '') {
            try {
                const accessToken = Cookies.get('access_token');
                if (!accessToken) {
                    console.error('User is not logged in');
                    setDialogTitle('Error');
                    setDialogContent('로그인이 필요합니다.');
                    setDialogOpen(true);
                    return;
                }
    
                const noticeRegisterDto = {
                    title: newNotice,
                    content: newNoticeContent
                };
    
                const config = {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                };
    
                const response = await axios.post(
                    'https://valanse.site/notice/register',
                    noticeRegisterDto,
                    config
                );
    
                if (response.status === 200 || response.status === 201) {
                    setDialogTitle('Success');
                    setDialogContent('공지가 성공적으로 추가되었습니다.');
                    setDialogOpen(true);
                } else {
                    console.error('Failed to add notice');
                    setDialogTitle('Error');
                    setDialogContent('공지 추가에 실패했습니다.');
                    setDialogOpen(true);
                }
            } catch (error) {
                console.error('Error occurred while adding notice:', error);
                setDialogTitle('Error');
                setDialogContent('공지 추가 중 오류가 발생했습니다.');
                setDialogOpen(true);
            }
        } else {
            setDialogTitle('Validation Error');
            setDialogContent('제목과 내용을 모두 입력해야 합니다.');
            setDialogOpen(true);
        }
    };

    return (
        <>
            <div style={{ backgroundColor: 'black' }}>
                <Container maxWidth="md" className="notii">
                    <Typography variant="h4" className="notii-title2" style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
                        공지작성
                    </Typography>
                    <Button
                        variant="contained"
                        className="button1_write"
                        style={{ color: 'white', backgroundColor: 'transparent', boxShadow: 'none' }}
                        onClick={() => navigate(-1)}
                    >
                        <ArrowBackIcon style={{ color: 'white', fontSize: '24px' }} />
                        <span style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>뒤로가기</span>
                    </Button>
                    <div className="textfield1">
                        <TextField
                            label="제목"
                            fullWidth
                            value={newNotice}
                            onChange={(e) => setNewNotice(e.target.value)}
                            variant="outlined"
                            InputLabelProps={{ style: { color: 'white' } }} // 레이블 텍스트 색상 변경
                            InputProps={{ style: { color: 'black', backgroundColor: '#f0f0f0' } }} // 텍스트 필드의 텍스트 색상 및 배경색 변경
                        />
                    </div>
                    <div style={{ marginBottom: '16px' }}></div> {/* 간격을 벌리는 부분 */}
                    <div className="textfield2">
                        <TextField
                            label="내용"
                            fullWidth
                            multiline
                            rows={12}
                            value={newNoticeContent}
                            onChange={(e) => setNewNoticeContent(e.target.value)}
                            variant="outlined"
                            InputLabelProps={{ style: { color: 'white' } }} // 레이블 텍스트 색상 변경
                            InputProps={{ style: { color: 'black', backgroundColor: '#f0f0f0' } }} // 텍스트 필드의 텍스트 색상 및 배경색 변경
                        />
                    </div>
                    <Button variant="contained" className="notii-button2" style={{ marginTop: '16px', backgroundColor: 'lime', color: 'white' }} onClick={handleAddNotice}>
                        작성
                    </Button>
                </Container>
            </div>
            <Dialog open={dialogOpen} onClose={handleDialogClose}>
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent>
                    <Typography>{dialogContent}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} color="primary">
                        확인
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default NoticeWrite;
