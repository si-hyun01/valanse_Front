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
      const commentIds = response.data.map(comment => comment.commentId);
      const commentContents = await Promise.all(commentIds.map(fetchCommentContent));
      const commentData = commentIds.reduce((acc, id, index) => {
        acc[id] = commentContents[index];
        return acc;
      }, {});
      setComments(commentData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setLoading(false);
    }
  };

  const fetchCommentContent = async (commentId) => {
    try {
      const response = await axios.get(`https://valanse.site/comment/${commentId}`);
      return response.data.content;
    } catch (error) {
      console.error('Error fetching comment content:', error);
      return null;
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
      const updatedComments = { ...comments };
      delete updatedComments[commentId];
      setComments(updatedComments);
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div>
      <h2 style={{ color: 'white' }}>댓글</h2>
      <div>
        <textarea value={newCommentContent} onChange={(e) => setNewCommentContent(e.target.value)} />
        <button onClick={handleCommentSubmit}>댓글 등록</button>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : Object.keys(comments).length === 0 ? (
        <div style={{ color: 'white' }}>아직 작성된 댓글이 없습니다.</div>
      ) : (
        <ul>
          {Object.keys(comments).map((commentId) => (
            <li key={commentId}>
              <div>{comments[commentId]}</div>
              <button onClick={() => handleCommentDelete(commentId)}>삭제</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CommentUI;
