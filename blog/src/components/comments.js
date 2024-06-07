import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CommentUI({ quizId }) {
  const [comments, setComments] = useState([]);
  const [newCommentContent, setNewCommentContent] = useState('');

  useEffect(() => {
    fetchComments();
  }, [quizId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`https://valanse.site/comment/quiz/${quizId}`);
      setComments(response.data);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
  };

  const handleCommentSubmit = async () => {
    try {
      await axios.post('https://valanse.site/comment/register', {
        content: newCommentContent,
        quizId: quizId,
      });
      setNewCommentContent('');
      fetchComments(); // 댓글 등록 후 댓글 목록을 다시 불러옴
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      await axios.delete(`https://valanse.site/comment/${commentId}`);
      setComments(comments.filter(comment => comment.commentId !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div>
      <h2>댓글</h2>
      <div>
        <textarea value={newCommentContent} onChange={(e) => setNewCommentContent(e.target.value)} />
        <button onClick={handleCommentSubmit}>댓글 등록</button>
      </div>
      <ul>
        {comments.map((comment) => (
          <li key={comment.commentId}>
            <div>{comment.content}</div>
            <button onClick={() => handleCommentDelete(comment.commentId)}>삭제</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CommentUI;
