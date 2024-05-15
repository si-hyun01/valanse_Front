// SignUpmodel.js

import React, { useState } from 'react';
import { Modal, Button, Container } from 'react-bootstrap';
import KaKaoimage from "../layouts/img/Kakao_login.png";
import Googleimage from "../layouts/img/Google_login1.png"; // 이미지 파일 경로 수정
import Naverimage from "../layouts/img/Naver_login.png";

const SignUpmodel = ({ show, onHide, saveAccessToken }) => {
  const [accessTokenDialog, setAccessTokenDialog] = useState(false); // 액세스 토큰 다이얼로그 표시 상태

  const getAccessToken = async (stateToken) => {
    try {
      const response = await fetch('http://54.180.170.88:8080/token/get', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ stateToken: stateToken })
      });
      if (response.ok) {
        const data = await response.json();
        return data.access_token;
      } else {
        throw new Error('Failed to get access token');
      }
    } catch (error) {
      console.error('Error getting access token:', error.message);
      return null;
    }
  };

  const handleLogin = async () => {
    const stateToken = window.location.search.split('=')[1]; // URL에서 stateToken 추출
    const accessToken = await getAccessToken(stateToken);
    if (accessToken) {
      saveAccessToken(accessToken); // 액세스 토큰을 부모 컴포넌트로 전달
      setAccessTokenDialog(true); // 액세스 토큰 다이얼로그 표시
      onHide(); // 모달 숨기기
    } else {
      console.error('Failed to get access token');
    }
  };

  const handleKakaoLogin = () => {
    window.location.href = "http://54.180.170.88:8080/oauth2/authorization/kakao";
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://54.180.170.88:8080/oauth2/authorization/google";
  };

  const handleNaverLogin = () => {
    window.location.href = "http://54.180.170.88:8080/oauth2/authorization/naver";
  };

  return (
    <>
      <Modal
        show={show}
        onHide={onHide}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Container>
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              로그인
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {/* 구글 로그인 버튼 */}
            <Button variant="light" onClick={handleGoogleLogin}>
              <img src={Googleimage} alt="구글 이미지" style={{ width: '170px', height: '45px' }} />
            </Button>
            {/* 카카오 로그인 버튼 */}
            <Button variant="light" onClick={handleKakaoLogin}>
              <img src={KaKaoimage} alt="카카오톡 이미지" />
            </Button>
            {/* 네이버 로그인 버튼 */}
            <Button variant="light" onClick={handleNaverLogin}>
              <img src={Naverimage} alt="네이버 이미지" style={{ width: '170px', height: '45px' }} />
            </Button>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={handleLogin}>로그인</Button>
            <Button onClick={onHide}>닫기</Button>
          </Modal.Footer>
        </Container>
      </Modal>
      {/* 액세스 토큰 다이얼로그 */}
      <Modal show={accessTokenDialog} onHide={() => setAccessTokenDialog(false)}>
        <Modal.Header closeButton>
          <Modal.Title>액세스 토큰 확인</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          액세스 토큰을 성공적으로 받아왔습니다:
          {/* 여기에 액세스 토큰 출력 */}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setAccessTokenDialog(false)}>닫기</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SignUpmodel;
