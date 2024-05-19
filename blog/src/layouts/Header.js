// Header.js
import React, { useState, useEffect } from "react";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import valanse_logo from "./img/valanse_logo.png";
import { Link } from 'react-router-dom';
import axios from 'axios';
import SignUpmodel from "../modal/SignUpmodel";
import Cookies from 'js-cookie';

const Header = () => {
    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const [stateToken, setStateToken] = useState('');
    const [accessToken, setAccessToken] = useState('');

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('stateToken');
        setStateToken(token);

        if (token) {
            getAccessToken(token);
        } else {
            // 쿠키에서 액세스 토큰 확인
            const accessTokenCookie = Cookies.get('access_token');
            if (accessTokenCookie) {
                // 로그인 상태로 설정
                setIsLoggedIn(true);
            }
        }
    }, []);

    const getAccessToken = async (stateToken) => {
        try {
            const response = await axios.post('https://valanse.site/token/get', null, {
                headers: {
                    'stateToken': stateToken,
                    'Content-Type': 'application/json'
                }
            });
            setAccessToken(response.data.data);
            // 액세스 토큰을 쿠키에 저장
            Cookies.set('access_token', response.data.data);
            // 로그인 상태로 설정
            setIsLoggedIn(true);
        } catch (error) {
            console.error('Error getting access token:', error.message);
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('https://valanse.site/token/logout', null, {
                headers: {
                    'stateToken': stateToken
                }
            });
            Cookies.remove('access_token');
            // 로그아웃 상태로 설정
            setIsLoggedIn(false);
        } catch (error) {
            console.error('Error during logout:', error);
        }
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
                            <img src={valanse_logo} alt="Valanse Logo" />
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                            <Nav className="ml-auto">
                                {isLoggedIn ? (
                                    <Nav.Link>
                                        <Button variant="secondary" onClick={handleLogout}>Logout</Button>
                                    </Nav.Link>
                                ) : (
                                    <Nav.Link>
                                        <Button variant="secondary" onClick={toggleSignUpModal}>Login</Button>
                                    </Nav.Link>
                                )}
                                <SignUpmodel show={showSignUpModal} onHide={toggleSignUpModal} />
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </header>
            {stateToken && (
                <div style={{ textAlign: 'center', margin: '20px' }}>
                    <h3>State Token: {stateToken}</h3>
                </div>
            )}
            {accessToken ? (
                <div style={{ textAlign: 'center', margin: '20px' }}>
                    <h3>Access Token: {accessToken}</h3>
                </div>
            ) : (
                <div style={{ textAlign: 'center', margin: '20px' }}>
                    <h3>No Access Token available.</h3>
                </div>
            )}
        </>
    );
};

export default Header;
