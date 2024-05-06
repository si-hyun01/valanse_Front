import React from 'react'
import { Modal, Button, Form, Container } from 'react-bootstrap'
import KaKaoimage from "../layouts/img/Kakao_login.png"
import Googleimage from "../layouts/img/Goolge_login.png"
import Naverimage from "../layouts/img/Naver_login.png"

const SignUpmodel = ({ show, onHide }) => {
  const handleSignUpButtonClick = () => {
    console.log('회원가입 페이지로 이동');
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
          <Button variant="light" onClick={handleSignUpButtonClick}>
            <img src={Googleimage} alt="구글 이미지" style={{ width: '170px', height: '45px' }} />
          </Button>
          {/* 카카오 로그인 버튼 */}
          <Button variant="light" onClick={handleSignUpButtonClick}>
            <img src={KaKaoimage} alt="카카오톡 이미지" />
          </Button>
          <Button variant="light" onClick={handleSignUpButtonClick}>
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
