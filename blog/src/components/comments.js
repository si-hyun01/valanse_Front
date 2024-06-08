import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CommentUI({ quizId }) {
  const [comments, setComments] = useState([]); // 배열로 초기화
  const [newCommentContent, setNewCommentContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchComments();
  }, [quizId]);

  const fetchComments = async () => {
    try {
      const response = await axios.get(`https://valanse.site/comment/${quizId}/quiz`);
      setComments(response.data.data); // 수정: response.data.data로 변경
      setLoading(false);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setLoading(false);
    }
  };

  const fetchCommentContent = async (commentId) => {
    try {
      const response = await axios.get(`https://valanse.site/comment/${commentId}`);
      return response.data; // 댓글 내용 반환
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
      fetchComments(); // 댓글 등록 후에 새로운 댓글 목록을 다시 가져옴
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      await axios.delete(`https://valanse.site/comment/${commentId}`);
      setComments(comments.filter(comment => comment.commentId !== commentId)); // 수정: filter로 변경
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
      ) : comments.length === 0 ? (
        <div style={{ color: 'white' }}>아직 작성된 댓글이 없습니다.</div>
      ) : (
        <ul>
          {comments.map(async (comment) => { // 수정: comments.map 사용
            const commentContent = await fetchCommentContent(comment.commentId); // 수정: comment.commentId로 변경
            return (
              <li key={comment.commentId}>
                <div>{commentContent}</div>
                <button onClick={() => handleCommentDelete(comment.commentId)}>삭제</button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default CommentUI;
