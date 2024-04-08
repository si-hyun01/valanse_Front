import React, { useState, useEffect } from 'react';
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import './notii.css'; // CSS 파일 

const NoticeDetail = ({ notice, onDelete }) => {
  return (
    <div className="notii">
      <Typography variant="h6" gutterBottom>{notice.title}</Typography>
      <Typography variant="subtitle2">글번호: {notice.id}</Typography>
      <Typography variant="subtitle2">등록일: {notice.date}</Typography>
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
          {notices.map((notice, index) => (
            <tr key={index} onClick={() => onItemClick(notice)}>
              <td>{notice.author}</td>
              <td>{notice.title}</td>
              <td>{notice.date}</td>
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

  const handleAddNotice = (newNotice) => {
    setNotices([...notices, newNotice]);
  };

  const handleNoticeClick = (notice) => {
    setSelectedNotice(notice);
  };

  const handleDeleteNotice = (notice) => {
    setNotices(notices.filter(item => item !== notice));
    setSelectedNotice(null);
  };

  useEffect(() => {
    // 컴포넌트가 처음 마운트될 때만 실행되도록 함.
    handleAddNotice({
      id: 1,
      author: '운영자',
      title: '공지사항의 제목 나오는 곳입니다.',
      date: '2024-04-08',
      views: 0,
      content: '공지 제목 눌러서 안에 내용이 나오나 테스트'
    });
  }, []); // 빈 배열을 전달하여 처음 마운트될 때만 실행

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
