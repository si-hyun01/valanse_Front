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
  Typography,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';

function CommentUI({ quizId }) {
  const [comments, setComments] = useState([]);
  const [newCommentContent, setNewCommentContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCommentId, setSelectedCommentId] = useState(null);
  const [editCommentContent, setEditCommentContent] = useState('');
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

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

  const handleCommentDelete = async () => {
    try {
      await axios.delete(`https://valanse.site/comment/${selectedCommentId}`);
      const updatedComments = comments.filter(comment => comment.commentId !== selectedCommentId);
      setComments(updatedComments);
      setOpenDeleteDialog(false);
      setSelectedCommentId(null);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const handleCommentEdit = async () => {
    try {
      await axios.patch(`https://valanse.site/comment/${selectedCommentId}`, null, {
        params: {
          content: editCommentContent
        }
      });
      setEditCommentContent('');
      setOpenEditDialog(false);
      fetchComments();
    } catch (error) {
      console.error('Error editing comment:', error);
    }
  };

  const handleMenuOpen = (event, commentId) => {
    setAnchorEl(event.currentTarget);
    setSelectedCommentId(commentId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditDialogOpen = (commentId, commentContent) => {
    setEditCommentContent(commentContent);
    setSelectedCommentId(commentId); // Ensure commentId is set correctly here
    setOpenEditDialog(true);
  };

  const handleEditDialogClose = () => {
    setOpenEditDialog(false);
  };

  const handleDeleteDialogOpen = (commentId) => {
    setSelectedCommentId(commentId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };

  return (
    <Box sx={{ padding: 2, backgroundColor: '#333', borderRadius: 2 }}>
      <Typography variant="h6" style={{ color: 'white' }}>댓글</Typography>
      <Box sx={{ marginBottom: 2 }}>
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
      </Box>
      {loading ? (
        <div style={{ color: 'white' }}>Loading...</div>
      ) : comments.length === 0 ? (
        <Typography style={{ color: 'white' }}>아직 작성된 댓글이 없습니다.</Typography>
      ) : (
        <List>
          {comments.map((comment) => (
            <ListItem key={comment.commentId} style={{ color: 'white' }}>
              <ListItemText
                primary={<Typography style={{ color: 'white' }}>{`User ID: ${comment.authorUserId}`}</Typography>}
                secondary={
                  <>
                    <Typography style={{ color: 'white' }} dangerouslySetInnerHTML={{ __html: comment.content.replace(/\n/g, '<br/>') }}></Typography>
                    <Typography style={{ color: 'white' }}>{`작성날짜: ${comment.createdAt}`}</Typography>
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
                <MenuItem onClick={() => handleEditDialogOpen(comment.commentId, comment.content)}>수정하기</MenuItem>
                <MenuItem onClick={() => { handleDeleteDialogOpen(comment.commentId); handleMenuClose(); }}>삭제하기</MenuItem>
              </Menu>
            </ListItem>
          ))}
        </List>
      )}

      <Dialog open={openEditDialog} onClose={handleEditDialogClose}>
        <DialogTitle>댓글 수정</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="editCommentContent"
            type="text"
            fullWidth
            multiline
            value={editCommentContent}
            onChange={(e) => setEditCommentContent(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleEditDialogClose} color="primary">취소</Button>
          <Button onClick={handleCommentEdit} color="primary">수정</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteDialog} onClose={handleDeleteDialogClose}>
        <DialogTitle>댓글 삭제</DialogTitle>
        <DialogContent>
          <Typography>정말로 이 댓글을 삭제하시겠습니까?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary">취소</Button>
          <Button onClick={handleCommentDelete} color="primary">삭제</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default CommentUI;
