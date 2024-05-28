import React, { useState, useEffect } from 'react';
import { Container, Typography, Button, TextField } from '@mui/material';
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
    <div className="notii" style={{ color: 'black' }}>
      {isEditing ? (
        <>
          <TextField
            label="Title"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Content"
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            multiline
            rows={4}
            fullWidth
            margin="normal"
          />
          <Button onClick={handleUpdate} color="primary">확인</Button>
          <Button onClick={() => setIsEditing(false)} color="secondary">취소</Button>
        </>
      ) : (
        <>
          <Typography variant="h6" gutterBottom>{notice.title}</Typography>
          <Typography variant="subtitle2">글번호: {notice.noticeId}</Typography>
          <Typography variant="subtitle2">등록일: {notice.createdAt}</Typography>
          <Typography variant="body1">
            {formattedContent}
          </Typography>
          <Button onClick={onGoBack} aria-label="go-back" color="primary">뒤로가기</Button>
          <Button onClick={() => onDelete(notice.noticeId)} aria-label="delete" color="error">삭제하기</Button>
          <Button onClick={() => setIsEditing(true)} aria-label="edit" color="primary">수정하기</Button>
        </>
      )}
    </div>
  );
};

const NoticeList = ({ notices, onItemClick }) => {
  return (
    <div className="notii-table" style={{ fontWeight: 'bold', color: 'black' }}>
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
      setNotices(notices.map(notice => (notice.noticeId === noticeId ? {notice, title, content } : notice)));
      setSelectedNotice({ selectedNotice, title, content });
    } catch (error) {
      console.error('Error updating notice:', error);
      alert('Failed to update the notice. Please try again.');
    }
  };

  const handleGoBack = () => {
    setShowDetail(false);
  };

  useEffect(() => {
    const fetchNotices = async () => {
      let fetchedNotices = [];
      const maxNoticeId = 10; // 10개만 체크
      for (let i = 1; i <= maxNoticeId; i++) {
        try {
          const response = await axios.get(`https://valanse.site/notice/${i}`);
          if (response.data && response.data.data) {
            fetchedNotices.push(response.data.data);
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            // 404 무시하기
            continue;
          } else {
            console.error('Error fetching notice:', error);
          }
        }
      }
      setNotices(fetchedNotices);
    };

    fetchNotices();
  }, []);

  return (
    <Container className="notii" style={{ marginTop: '50px', maxWidth: "80%" }}>
      <Typography variant="h4" className="notii-title" style={{ fontWeight: 'bold', color: 'black', marginBottom: '10px' }}>
        공지게시판
      </Typography>
      {!showDetail ? (
        <>
          <NoticeList notices={notices} onItemClick={handleNoticeClick} />
          <Button variant="contained" color="primary" component={Link} to=
            "/noti_write" className="notii-button" style={{ marginTop: '30px' }}>
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
  );
};

export default NoticeBoard;
