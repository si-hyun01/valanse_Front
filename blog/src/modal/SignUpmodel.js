import React from 'react';
import { Modal, Button, Container } from 'react-bootstrap';
import KaKaoimage from "../layouts/img/Kakao_login.png";
import Googleimage from "../layouts/img/Google_login1.png";
import Naverimage from "../layouts/img/Naver_login.png";

const SignUpModel = ({ show, onHide }) => {
  const handleKakaoLogin = () => {
    window.location.href = "https://valanse.site/login/oauth2/authorization/kakao";
  };

  const handleGoogleLogin = () => {
    window.location.href = "https://valanse.site/login/oauth2/authorization/google";
  };

  const handleNaverLogin = () => {
    window.location.href = "https://valanse.site/login/oauth2/authorization/naver";
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
        <Modal.Body className="d-flex justify-content-center flex-column align-items-center">
          <Button variant="light" onClick={handleGoogleLogin} className="mb-2">
            <img src={Googleimage} alt="구글 이미지" style={{ width: '170px', height: '45px' }} />
          </Button>
          <Button variant="light" onClick={handleKakaoLogin} className="mb-2">
            <img src={KaKaoimage} alt="카카오톡 이미지" style={{ width: '170px', height: '45px' }} />
          </Button>
          <Button variant="light" onClick={handleNaverLogin} className="mb-2">
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

export default SignUpModel;
