import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  TextField,
  Button,
  IconButton,
  Menu,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

function CommentUI({ quizId }) {
  const [comments, setComments] = useState([]);
  const [newCommentContent, setNewCommentContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCommentId, setSelectedCommentId] = useState(null);

  useEffect(() => {
    fetchComments();
  }, [quizId]);

  const formatDate = (createdAt) => {
    const date = new Date(createdAt);
    date.setHours(date.getHours() + 10); // 10시간 추가
    const options = {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Seoul' // 한국 시간
    };
    return new Intl.DateTimeFormat('ko-KR', options).format(date);
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`https://valanse.site/comment/${quizId}/quiz`);
      const commentsData = response.data.data;
      const commentsContent = await Promise.all(commentsData.map(async (comment) => {
        const commentContentResponse = await axios.get(`https://valanse.site/comment/${comment.commentId}`);
        const commentData = commentContentResponse.data.data;
        return {
          commentId: commentData.commentId,
          authorUserId: commentData.authorUserId,
          content: commentData.content,
          createdAt: formatDate(commentData.createdAt) // 시간 변환
        };
      }));
      setComments(commentsContent);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setLoading(false);
    }
  };

  const handleCommentSubmit = async () => {
    try {
      await axios.post('https://valanse.site/comment/register', {
        content: newCommentContent,
        quizId: quizId,
      });
      setNewCommentContent('');
      fetchComments();
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      await axios.delete(`https://valanse.site/comment/${commentId}`);
      const updatedComments = comments.filter(comment => comment.commentId !== commentId);
      setComments(updatedComments);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleMenuOpen = (event, commentId) => {
    setAnchorEl(event.currentTarget);
    setSelectedCommentId(commentId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCommentId(null);
  };

  return (
    <div>
      <Typography variant="h6" style={{ color: 'white' }}>댓글</Typography>
      <div style={{ marginBottom: '20px' }}>
        <TextField
          id="commentContent"
          name="commentContent"
          placeholder="댓글을 입력하세요"
          multiline
          fullWidth
          value={newCommentContent}
          onChange={(e) => setNewCommentContent(e.target.value)}
          InputProps={{
            style: { color: 'white' },
            sx: { '& .MuiInputBase-root': { borderBottom: '1px solid white' } }
          }}
          variant="standard"
        />
        <Button onClick={handleCommentSubmit} variant="contained" style={{ marginTop: '10px' }}>댓글 등록</Button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : comments.length === 0 ? (
        <Typography style={{ color: 'white' }}>아직 작성된 댓글이 없습니다.</Typography>
      ) : (
        <List>
          {comments.map((comment) => (
            <ListItem key={comment.commentId} style={{ color: 'white' }}>
              <ListItemText
                primary={`User ID: ${comment.authorUserId}`}
                secondary={
                  <>
                    <span dangerouslySetInnerHTML={{ __html: comment.content.replace(/\n/g, '<br/>') }}></span>
                    <br />
                    {`작성날짜: ${comment.createdAt}`}
                  </>
                }
              />
              <IconButton
                edge="end"
                aria-label="more"
                aria-controls="comment-menu"
                aria-haspopup="true"
                onClick={(e) => handleMenuOpen(e, comment.commentId)}
                style={{ color: 'white' }}
              >
                <MoreVertIcon />
              </IconButton>
              <Menu
                id="comment-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl) && selectedCommentId === comment.commentId}
                onClose={handleMenuClose}
              >
                <MenuItem onClick={() => { handleCommentDelete(comment.commentId); handleMenuClose(); }}>삭제</MenuItem>
                {/* 다른 메뉴 아이템을 여기에 추가할 수 있습니다. */}
              </Menu>
            </ListItem>
          ))}
        </List>
      )}
    </div>
  );
}

export default CommentUI;
