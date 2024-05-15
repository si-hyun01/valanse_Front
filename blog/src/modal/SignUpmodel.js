import React, { useState, useEffect } from 'react';
import { Modal, Button, Container } from 'react-bootstrap';
import KaKaoimage from "../layouts/img/Kakao_login.png";
import Googleimage from "../layouts/img/Google_login1.png";
import Naverimage from "../layouts/img/Naver_login.png";
import Cookies from 'js-cookie'; // js-cookie 패키지 import

const SignUpmodel = ({ show, onHide }) => {
  const [stateToken, setStateToken] = useState('');

  useEffect(() => {
    // URL에서 상태 토큰 추출
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('stateToken');
    setStateToken(token);
  }, []);

  const getAccessToken = async () => {
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
    const accessToken = await getAccessToken();
    if (accessToken) {
      // 쿠키에 액세스 토큰 저장 (유효기간 설정 가능)
      Cookies.set('access_token', accessToken, { expires: 1 }); // 1일 동안 유효한 쿠키
      onHide(); // 모달 닫기
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
          {/* 구글, 카카오, 네이버 로그인 버튼 */}
          <Button variant="light" onClick={handleGoogleLogin}>
            <img src={Googleimage} alt="구글 이미지" style={{ width: '170px', height: '45px' }} />
          </Button>
          <Button variant="light" onClick={handleKakaoLogin}>
            <img src={KaKaoimage} alt="카카오톡 이미지" />
          </Button>
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
  );
};

export default SignUpmodel;
