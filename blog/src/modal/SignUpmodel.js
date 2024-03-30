import React from 'react';
import { Modal, Button, Form, Container } from 'react-bootstrap';
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const SignUpmodel = ({ show, onHide }) => {
  const responseGoogle = (response) => { // 구글 로그인 성공이나 실패 띄울 때 쓸거에요
    console.log(response);
  };

  const clientId = '1047897370733-dovpvu7kv56d4f6vf2vvtborl7j66nct.apps.googleusercontent.com'; // 구글 클라이언트 ID

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
            회원가입
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formGroupEmail">
              <Form.Label>닉네임</Form.Label>
              <Form.Control type="email" placeholder="닉네임 입력하세요." />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupEmail">
              <Form.Label>아이디</Form.Label>
              <Form.Control type="email" placeholder="아이디 입력하세요." />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupPassword">
              <Form.Label>비밀번호</Form.Label>
              <Form.Control
                type="password"
                placeholder="비밀번호 입력하세요."
              />
            </Form.Group>
          </Form>
          <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin
              onSuccess={(res) => {
                console.log(res);
              }}
              onFailure={(err) => {
                console.log(err);
              }}
            />
          </GoogleOAuthProvider>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="info" type="button">
            로그인
          </Button>
          <Button onClick={onHide}>닫기</Button>
        </Modal.Footer>
      </Container>
    </Modal>
  );
};

export default SignUpmodel;
