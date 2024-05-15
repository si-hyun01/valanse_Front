// Header.js

import React, { useState, useEffect } from "react";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import valanse_logo from "./img/valanse_logo.png";
import axios from 'axios'; // Axios 라이브러리 추가
import { Link } from 'react-router-dom';
import SignUpmodel from "../modal/SignUpmodel";

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 상태를 관리하는 상태 변수
    const [showSignUpModal, setShowSignUpModal] = useState(false); // 회원가입 모달의 표시 여부를 관리하는 상태

    // 컴포넌트가 마운트될 때 서버에 로그인 상태를 확인하는 함수 호출
    useEffect(() => {
        checkLoginStatus();
    }, []);

    // 서버에 로그인 상태를 확인하는 함수
    const checkLoginStatus = async () => {
        try {
            // 로컬 스토리지에서 토큰을 가져옴
            const token = localStorage.getItem('accessToken');
            if (token) {
                setIsLoggedIn(true);
            } else {
                setIsLoggedIn(false);
            }
        } catch (error) {
            console.error('로그인 상태 확인 중 에러 발생:', error);
        }
    };

    // 로그아웃 함수
    const handleLogout = async () => {
        try {
            // 로컬 스토리지에서 토큰 제거
            localStorage.removeItem('accessToken');
            // 로그아웃 성공 시 상태 변경
            setIsLoggedIn(false);
        } catch (error) {
            console.error('로그아웃 중 에러 발생:', error);
        }
    };

    // 로그인 모달을 열거나 닫는 함수
    const toggleSignUpModal = () => {
        setShowSignUpModal(!showSignUpModal);
    };

    // 토큰을 받아 로컬 스토리지에 저장하는 함수
    const handleTokenReceived = (token) => {
        try {
            // 로컬 스토리지에 토큰 저장
            localStorage.setItem('accessToken', token);
            // 로그인 상태 업데이트
            setIsLoggedIn(true);
        } catch (error) {
            console.error('토큰 저장 중 에러 발생:', error);
        }
    };

    return (
        <>
            <header>
                <Navbar bg="light" expand="lg">
                    <Container>
                        <Navbar.Brand as={Link} to="/">
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
                                <SignUpmodel show={showSignUpModal} onHide={toggleSignUpModal} onTokenReceived={handleTokenReceived} />
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </header>
        </>
    );
};

export default Header;
