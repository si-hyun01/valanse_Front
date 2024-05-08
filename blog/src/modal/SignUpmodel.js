import React, { useEffect } from 'react';
import { Modal, Button, Container } from 'react-bootstrap';
import KaKaoimage from "../layouts/img/Kakao_login.png";
import Googleimage from "../layouts/img/Goolge_login.png";
import Naverimage from "../layouts/img/Naver_login.png";

const SignUpmodel = ({ show, onHide }) => {
  // 로그인 후 리디렉션된 URL에서 stateToken을 추출하는 함수
  const getStateTokenFromRedirectURL = () => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('stateToken');
  };

  // 백엔드에 stateToken을 전달하는 함수
  const sendStateTokenToBackend = (stateToken) => {
    // stateToken을 이용하여 백엔드에 요청을 보내는 로직을 작성합니다.
    // 예: fetch 또는 axios를 사용하여 POST 요청을 보냅니다.
    // 예: fetch('백엔드_URL', { method: 'POST', body: JSON.stringify({ stateToken }) });
    console.log('stateToken:', stateToken);
  };

  useEffect(() => {
    // 컴포넌트가 렌더링될 때 실행되는 부분
    const stateToken = getStateTokenFromRedirectURL();
    if (stateToken) {
      // stateToken이 존재하면 백엔드에 전달
      sendStateTokenToBackend(stateToken);
    }
  }, []); // 빈 배열을 넘겨 useEffect가 컴포넌트 마운트 시에만 실행되도록 설정

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
          <Button onClick={onHide}>닫기</Button>
        </Modal.Footer>
      </Container>
    </Modal>
  );
};

export default SignUpmodel;
