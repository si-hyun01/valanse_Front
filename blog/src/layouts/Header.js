import React, { useState, useEffect } from "react";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import valanse_logo from "./img/valanse_logo.png";
import useAccessToken from '../hooks/useAccessToken'; // 커스텀 훅 추가

const Header = () => {
    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [stateToken, setStateToken] = useState('');
    const accessToken = useAccessToken(stateToken); // 커스텀 훅 사용

    useEffect(() => {
        // 쿠키에서 액세스 토큰 가져오기
        const accessTokenCookie = Cookies.get('access_token');
        // 액세스 토큰이 존재하는 경우 로그인 상태 설정
        setIsLoggedIn(accessTokenCookie ? true : false);

        // URL에서 상태 토큰 추출
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('stateToken');
        setStateToken(token);
    }, []);

    const handleLogout = async () => {
        // 로그아웃 로직 추가
    };

    const toggleSignUpModal = () => {
        setShowSignUpModal(!showSignUpModal);
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
                                ) : (
                                    <Nav.Link>
                                        <Button variant="secondary" onClick={toggleSignUpModal}>로그인</Button>
                                    </Nav.Link>
                                )}
                                {/* 로그인 모달 */}
                                <SignUpmodel show={showSignUpModal} onHide={toggleSignUpModal} />
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </header>
            {/* 나머지 코드 생략 */}
        </>
    );
};

export default Header;
