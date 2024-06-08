import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, TextField, Card, CardContent } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './notii.css'; // CSS 파일 

const NoticeDetail = ({ notice, onDelete, onGoBack, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(notice.title);
  const [editedContent, setEditedContent] = useState(notice.content);

  const handleUpdate = () => {
    onUpdate(notice.noticeId, editedTitle, editedContent);
    setIsEditing(false);
  };

  const formattedContent = notice.content.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

  return (
    <Card className="notii" sx={{ bgcolor: 'black', borderRadius: '16px', p: 2 }}>
      <CardContent>
        {isEditing ? (
          <>
            <TextField
              label="Title"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              fullWidth
              margin="normal"
              sx={{ input: { color: 'white' }, label: { color: 'white' } }}
            />
            <TextField
              label="Content"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              multiline
              rows={4}
              fullWidth
              margin="normal"
              sx={{ textarea: { color: 'white' }, label: { color: 'white' } }}
            />
            <Button onClick={handleUpdate} color="primary" sx={{ borderColor: 'lime', color: 'lime' }}>확인</Button>
            <Button onClick={() => setIsEditing(false)} color="secondary" sx={{ borderColor: 'red', color: 'red' }}>취소</Button>
          </>
        ) : (
          <>
            <Typography variant="h6" gutterBottom sx={{ color: 'white' }}>{notice.title}</Typography>
            <Typography variant="subtitle2" sx={{ color: 'white' }}>글번호: {notice.noticeId}</Typography>
            <Typography variant="subtitle2" sx={{ color: 'white' }}>등록일: {notice.createdAt}</Typography>
            <Typography variant="body1" sx={{ color: 'white' }}>
              {formattedContent}
            </Typography>
            <Button onClick={onGoBack} aria-label="go-back" color="primary" sx={{ borderColor: 'lime', color: 'lime' }}>뒤로가기</Button>
            <Button onClick={() => onDelete(notice.noticeId)} aria-label="delete" color="error" sx={{ borderColor: 'red', color: 'red' }}>삭제하기</Button>
            <Button onClick={() => setIsEditing(true)} aria-label="edit" color="primary" sx={{ borderColor: 'lime', color: 'lime' }}>수정하기</Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const NoticeList = ({ notices, onItemClick }) => {
  return (
    <div className="notii-table" style={{ fontWeight: 'bold', color: 'white' }}>
      <table>
        <thead>
          <tr>
            <th>작성자</th>
            <th>제목</th>
            <th>날짜</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody>
          {notices.map((notice) => (
            <tr key={notice.noticeId} onClick={() => onItemClick(notice)}>
              <td>{notice.authorId}</td>
              <td className="title-cell">{notice.title}</td> {/* 제목 열에 클래스 추가 */}
              <td>{new Date(notice.createdAt).toLocaleDateString()}</td>
              <td>{notice.views}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const NoticeBoard = () => {
  const [notices, setNotices] = useState([]);
  const [selectedNotice, setSelectedNotice] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const handleNoticeClick = async (notice) => {
    try {
      // 공지사항 조회수 증가 API 호출
      await axios.post(`https://valanse.site/notice/${notice.noticeId}/increase-view`, {
        headers: {
          'accept': 'application/json;charset=UTF-8'
        }
      });
      // 조회수 증가 후 상태 업데이트
      setNotices(
        notices.map(item =>
          item.noticeId === notice.noticeId
            ? { ...item, views: item.views + 1 }
            : item
        )
      );
      // 상세 내용 표시
      setSelectedNotice(notice);
      setShowDetail(true);
    } catch (error) {
      console.error('Error increasing views:', error);
      alert('Failed to increase views. Please try again.');
    }
  };

  const handleDeleteNotice = async (noticeId) => {
    try {
      await axios.delete(`https://valanse.site/notice/${noticeId}`, {
        headers: {
          'accept': 'application/json;charset=UTF-8'
        }
      });
      setNotices(notices.filter(item => item.noticeId !== noticeId));
      setSelectedNotice(null);
      setShowDetail(false);
    } catch (error) {
      console.error('Error deleting notice:', error);
      alert('Failed to delete the notice. Please try again.');
    }
  };

  const handleUpdateNotice = async (noticeId, title, content) => {
    try {
      await axios.patch(`https://valanse.site/notice/${noticeId}`, {
        title,
        content
      }, {
        headers: {
          'accept': 'application/json;charset=UTF-8',
          'Content-Type': 'application/json;charset=UTF-8'
        }
      });
      setNotices(notices.map(notice => (notice.noticeId === noticeId ? { ...notice, title, content } : notice)));
      setSelectedNotice({ ...selectedNotice, title, content });
    } catch (error) {
      console.error('Error updating notice:', error);
      alert('Failed to update the notice. Please try again.');
    }
  };

  const handleGoBack = () => {
    setShowDetail(false);
    setSelectedNotice(null);
  };

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        const response = await axios.get('https://valanse.site/notice/all', {
          headers: {
            'accept': 'application/json;charset=UTF-8'
          }
        });
        setNotices(response.data.data);
      } catch (error) {
        console.error('Error fetching notices:', error);
      }
    };

    fetchNotices();
  }, []);

  return (
    <div>
      <Container className="neon-container" style={{ marginTop: '50px', maxWidth: "80%" }}>
        <Typography variant="h4" className="notii-title" style={{ fontWeight: 'bold', color: 'white', marginBottom: '10px', textAlign: 'center', fontSize: '2.5rem' }}>
          공지게시판
        </Typography>
        {!showDetail ? (
          <>
            <NoticeList notices={notices} onItemClick={handleNoticeClick} />
            <Button variant="contained" color="primary" component={Link} to="/noti_write" className="notii-button" style={{ marginTop: '30px', borderColor: 'lime', color: 'white', backgroundColor: 'hotpink' }}>
              공지 작성하기
            </Button>
          </>
        ) : (
          <NoticeDetail
            notice={selectedNotice}
            onDelete={handleDeleteNotice}
            onGoBack={handleGoBack}
            onUpdate={handleUpdateNotice}
          />
        )}
      </Container>
    </div>
  );
};

export default NoticeBoard;
