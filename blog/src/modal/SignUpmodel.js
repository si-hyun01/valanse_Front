import React, { useState } from 'react';
import { Modal, Button, Container } from 'react-bootstrap';
import KaKaoimage from "../layouts/img/Kakao_login.png";
import Googleimage from "../layouts/img/Goolge_login.png";
import Naverimage from "../layouts/img/Naver_login.png";
import axios from 'axios'; // Axios 라이브러리 추가

const SignUpmodel = ({ show, onHide }) => {
    const [accessToken, setAccessToken] = useState('');

    const handleKakaoLogin = async () => {
        try {
            const response = await axios.post('http://54.180.170.88:8080/oauth2/authorization/kakao');
            const stateToken = response.data.stateToken;
            const accessTokenResponse = await axios.post('http://54.180.170.88:8080/token/get', {}, {
                headers: {
                    stateToken: stateToken
                }
            });
            const receivedAccessToken = accessTokenResponse.data.data;
            setAccessToken(receivedAccessToken);
        } catch (error) {
            console.error('카카오 로그인 에러:', error);
        }
    };

    const handleGoogleLogin = async () => {
        try {
            const response = await axios.post('http://54.180.170.88:8080/oauth2/authorization/google');
            const stateToken = response.data.stateToken;
            const accessTokenResponse = await axios.post('http://54.180.170.88:8080/token/get', {}, {
                headers: {
                    stateToken: stateToken
                }
            });
            const receivedAccessToken = accessTokenResponse.data.data;
            setAccessToken(receivedAccessToken);
        } catch (error) {
            console.error('구글 로그인 에러:', error);
        }
    };

    const handleNaverLogin = async () => {
        try {
            const response = await axios.post('http://54.180.170.88:8080/oauth2/authorization/naver');
            const stateToken = response.data.stateToken;
            const accessTokenResponse = await axios.post('http://54.180.170.88:8080/token/get', {}, {
                headers: {
                    stateToken: stateToken
                }
            });
            const receivedAccessToken = accessTokenResponse.data.data;
            setAccessToken(receivedAccessToken);
        } catch (error) {
            console.error('네이버 로그인 에러:', error);
        }
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
