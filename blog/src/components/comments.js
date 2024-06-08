import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CommentUI({ quizId }) {
  const [comments, setComments] = useState([]);
  const [newCommentContent, setNewCommentContent] = useState('');
  const [loading, setLoading] = useState(true);

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
              <div id={`comment-${comment.commentId}`} name={`comment-${comment.commentId}`} style={{ color: 'white' }}>
                <p>User ID: {comment.authorUserId}</p>
                <p>{comment.content}</p>
                <p>작성날짜: {comment.createdAt}</p>
              </div>
              <button onClick={() => handleCommentDelete(comment.commentId)}>삭제</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CommentUI;
