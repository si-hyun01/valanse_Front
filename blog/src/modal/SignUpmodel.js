import React from 'react';
import { Modal, Button, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom'; // useHistory 대신 useNavigate를 가져옵니다.
import KaKaoimage from "../layouts/img/Kakao_login.png";
import Googleimage from "../layouts/img/Google_login1.png";
import Naverimage from "../layouts/img/Naver_login.png";

const SignUpmodel = ({ show, onHide }) => {
  const navigate = useNavigate(); // useHistory 대신 useNavigate 훅을 사용하여 navigate 함수를 가져옵니다.

  // 로그인 후에 사용자를 리다이렉션할 URL을 기억합니다.
  const redirectUrl = () => {
    // 여기서는 로그인 후에 사용자를 '/' 경로로 리다이렉션합니다.
    return '/';
  };

  // 각 로그인 버튼 클릭 시 해당 OAuth 서비스로 리다이렉션합니다.
  const handleKakaoLogin = () => {
    navigate("https://valanse.site/login/oauth2/authorization/kakao?redirect_uri=" + encodeURIComponent(redirectUrl()));
  };

  const handleGoogleLogin = () => {
    navigate("https://valanse.site/login/oauth2/authorization/google?redirect_uri=" + encodeURIComponent(redirectUrl()));
  };

  const handleNaverLogin = () => {
    navigate("https://valanse.site/oauth2/authorization/naver?redirect_uri=" + encodeURIComponent(redirectUrl()));
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
          <Button onClick={onHide}>닫기</Button>
        </Modal.Footer>
      </Container>
    </Modal>
  );
};

export default SignUpmodel;
