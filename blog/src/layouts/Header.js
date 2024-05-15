import React, { useState, useEffect } from "react";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import valanse_logo from "./img/valanse_logo.png";
import axios from 'axios'; // Axios 라이브러리 추가
import SignUpmodel from "../modal/SignUpmodel";

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 관리하는 상태 변수
    const [showSignUpModal, setShowSignUpModal] = useState(false); // 회원가입 모달의 표시 여부를 관리하는 상태

    useEffect(() => {
        // 로컬 스토리지에서 액세스 토큰을 가져와서 로그인 상태를 설정
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            setIsLoggedIn(true);
        }
    }, []);

    // 로그아웃 함수
    const handleLogout = async () => {
        try {
            // 액세스 토큰 가져오기
            const accessToken = localStorage.getItem('accessToken');

            // 서버에 로그아웃 요청 보내기
            await axios.post('http://54.180.170.88:8080/token/logout', {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            // 로그아웃 성공 시 상태 변경
            setIsLoggedIn(false);
            // 로그아웃 후 액세스 토큰 삭제
            localStorage.removeItem('accessToken');
        } catch (error) {
            console.error('로그아웃 중 에러 발생:', error);
        }
    };

    // 로그인 모달을 열거나 닫는 함수
    const toggleSignUpModal = () => {
        setShowSignUpModal(!showSignUpModal);
    };

    const saveAccessTokenToLocalStorage = (accessToken) => {
        localStorage.setItem('accessToken', accessToken);
    };

    return (
        <>
            <header>
                <Navbar bg="light" expand="lg">
                    <Container>
                        <Navbar.Brand href="/">
                            <img src={valanse_logo} alt="노이즈 로고" />
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                            <Nav className="ml-auto">
                                {/* 로그인 또는 로그아웃 버튼 */}
                                {isLoggedIn ? (
                                    <Nav.Link>
                                        <Button variant="secondary" onClick={handleLogout}>로그아웃</Button>
                                    </Nav.Link>
                                ) : null}
                                {!isLoggedIn ? (
                                    <Nav.Link>
                                        <Button variant="secondary" onClick={toggleSignUpModal}>로그인</Button>
                                    </Nav.Link>
                                ) : null}
                                {/* 로그인 모달 */}
                                <SignUpmodel show={showSignUpModal} onHide={toggleSignUpModal} saveAccessToken={saveAccessTokenToLocalStorage} />
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </header>
        </>
    );
};

export default Header;
