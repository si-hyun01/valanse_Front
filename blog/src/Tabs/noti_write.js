import React, { useState } from 'react';
import { Button, Container, Grid, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import Cookies from 'js-cookie';

function NoticeWrite() {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogMessage, setDialogMessage] = useState('');

    const handleAddNotice = async () => {
        if (title.trim() !== '' && content.trim() !== '') {
            try {
                const accessToken = Cookies.get('access_token');
                if (!accessToken) {
                    setDialogMessage('로그인 후에 공지를 작성할 수 있습니다.');
                    setDialogOpen(true);
                    return;
                }

                const response = await axios.post('https://valanse.site/notice/register', {
                    noticeRegisterDto: {
                        title: title,
                        content: content
                    }
                }, {
                    headers: {
                        'accept': 'application/json;charset=UTF-8',
                        'Content-Type': 'application/json;charset=UTF-8',
                        'Authorization': accessToken // 액세스 토큰 추가
                    }
                });

                if (response.status === 200) {
                    setDialogMessage('공지사항이 성공적으로 등록되었습니다.');
                } else {
                    setDialogMessage('공지사항 등록에 실패하였습니다.');
                }
                setDialogOpen(true);
            } catch (error) {
                console.error('Error adding notice:', error);
                setDialogMessage('공지사항 등록 중 에러가 발생하였습니다.');
                setDialogOpen(true);
            }
        } else {
            setDialogMessage('제목과 내용을 입력해주세요.');
            setDialogOpen(true);
        }
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        if (dialogMessage === '공지사항이 성공적으로 등록되었습니다.') {
            // 등록 성공 시 추가 작업 수행
        }
    };

    return (
        <Container maxWidth="md">
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        label="제목"
                        fullWidth
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        label="내용"
                        fullWidth
                        multiline
                        rows={8}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Button variant="contained" color="primary" onClick={handleAddNotice}>
                        등록
                    </Button>
                </Grid>
            </Grid>
            <Dialog open={dialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>알림</DialogTitle>
                <DialogContent>
                    {dialogMessage}
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

export default NoticeWrite;
