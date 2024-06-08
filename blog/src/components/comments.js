import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CommentUI({ quizId }) {
  const [comments, setComments] = useState({});
  const [newCommentContent, setNewCommentContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [quizId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`https://valanse.site/comment/${quizId}/quiz`);
      setComments(response.data); // API 응답 데이터 형식에 맞춰 수정
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
      fetchComments(); // 댓글 등록 후에 새로운 댓글 목록을 다시 가져옴
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
              <div>{comments[commentId].content}</div>
              <button onClick={() => handleCommentDelete(commentId)}>삭제</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CommentUI;
