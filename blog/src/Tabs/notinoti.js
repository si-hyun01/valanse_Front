import React, { useState, useEffect } from 'react';
import { Container, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './notii.css'; // CSS 파일 

const NoticeDetail = ({ notice, onDelete, onGoBack }) => {
  const formattedContent = notice.content.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

  return (
    <div className="notii" style={{ color: 'black' }}>
      <Typography variant="h6" gutterBottom>{notice.title}</Typography>
      <Typography variant="subtitle2">글번호: {notice.noticeId}</Typography>
      <Typography variant="subtitle2">등록일: {notice.createdAt}</Typography>
      <Typography variant="body1">
        {formattedContent}
      </Typography>
      <Button onClick={onGoBack} aria-label="go-back" color="primary">
        뒤로가기
      </Button>
      <Button onClick={() => onDelete(notice)} aria-label="delete" color="error">
        Delete
      </Button>
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

  const handleNoticeClick = (notice) => {
    setSelectedNotice(notice);
    setShowDetail(true);
  };

  const handleDeleteNotice = (notice) => {
    setNotices(notices.filter(item => item !== notice));
    setSelectedNotice(null);
    setShowDetail(false);
  };

  const handleGoBack = () => {
    setShowDetail(false);
  };

  useEffect(() => {
    const fetchNotices = async () => {
      let fetchedNotices = [];
      const maxNoticeId = 10; // 20개만 체크
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
    <Container maxWidth="md" className="notii" style={{ marginTop: '50px' }}>
      <Typography variant="h4" className="notii-title" style={{ fontWeight: 'bold', color: 'black', marginBottom: '10px' }}>
        공지게시판
      </Typography>
      {!showDetail ? (
        <>
          <NoticeList notices={notices} onItemClick={handleNoticeClick} />
          <Button variant="contained" color="primary" component={Link} to="/noti_write" className="notii-button" style={{ marginTop: '30px' }}>
            공지 작성하기
          </Button>
        </>
      ) : (
        <NoticeDetail notice={selectedNotice} onDelete={handleDeleteNotice} onGoBack={handleGoBack} />
      )}
    </Container>
  );
};

export default NoticeBoard;
