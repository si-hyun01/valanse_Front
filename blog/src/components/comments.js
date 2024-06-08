import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CommentUI({ quizId }) {
  const [comments, setComments] = useState([]);
  const [newCommentContent, setNewCommentContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [quizId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`https://valanse.site/comment/${quizId}/quiz`);
      const commentsData = response.data.data;
      const commentsContent = await Promise.all(commentsData.map(async (comment) => {
        const commentContentResponse = await axios.get(`https://valanse.site/comment/${comment.commentId}`);
        return commentContentResponse.data;
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

  return (
    <div>
      <h2 style={{ color: 'white' }}>댓글</h2>
      <div>
        <textarea id="commentContent" name="commentContent" value={newCommentContent} onChange={(e) => setNewCommentContent(e.target.value)} />
        <button onClick={handleCommentSubmit}>댓글 등록</button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : comments.length === 0 ? (
        <div style={{ color: 'white' }}>아직 작성된 댓글이 없습니다.</div>
      ) : (
        <ul>
          {comments.map((comment) => (
            <li key={comment.commentId}>
              <div id={`comment-${comment.commentId}`} name={`comment-${comment.commentId}`} style={{ color: 'white' }}>{comment.content}</div>
              <button onClick={() => handleCommentDelete(comment.commentId)}>삭제</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CommentUI;
