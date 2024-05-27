import React, { useState, useEffect } from 'react';
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './notii.css'; // CSS 파일 

const NoticeDetail = ({ notice, onDelete }) => {
  return (
    <div className="notii">
      <Typography variant="h6" gutterBottom>{notice.title}</Typography>
      <Typography variant="subtitle2">글번호: {notice.noticeId}</Typography>
      <Typography variant="subtitle2">등록일: {notice.createdAt}</Typography>
      <Typography variant="body1">{notice.content}</Typography>
      <Button onClick={() => onDelete(notice)} aria-label="delete" color="error">
        Delete
      </Button>
    </div>
  );
};

const NoticeList = ({ notices, onItemClick }) => {
  return (
    <div className="notii-table">
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
              <td>{notice.title}</td>
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

  const handleNoticeClick = (notice) => {
    setSelectedNotice(notice);
  };

  const handleDeleteNotice = (notice) => {
    setNotices(notices.filter(item => item !== notice));
    setSelectedNotice(null);
  };

  useEffect(() => {
    const fetchNotices = async () => {
      let fetchedNotices = [];
      const maxNoticeId = 20; // Max notice ID to check
      for (let i = 1; i <= maxNoticeId; i++) {
        try {
          const response = await axios.get(`https://valanse.site/notice/${i}`);
          if (response.data && response.data.data) {
            fetchedNotices.push(response.data.data);
          }
        } catch (error) {
          if (error.response && error.response.status === 404) {
            // Ignore 404 errors and continue
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
    <Container maxWidth="md" className="notii">
      <Typography variant="h4" className="notii-title">
        공지게시판
      </Typography>
      {!selectedNotice ? (
        <>
          <NoticeList notices={notices} onItemClick={handleNoticeClick} />
          <Button variant="contained" color="primary" component={Link} to="/noti_write" className="notii-button">
            공지 작성하기
          </Button>
        </>
      ) : (
        <NoticeDetail notice={selectedNotice} onDelete={handleDeleteNotice} />
      )}
    </Container>
  );
};

export default NoticeBoard;
