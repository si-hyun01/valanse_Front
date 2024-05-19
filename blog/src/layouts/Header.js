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
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 여기에 isLoggedIn 상태를 정의합니다.
    const [stateToken, setStateToken] = useState('');
    const [accessToken, setAccessToken] = useState('');

    useEffect(() => {
        const accessTokenCookie = Cookies.get('access_token');
        setIsLoggedIn(accessTokenCookie ? true : false);

        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('stateToken');
        setStateToken(token);

        if (token) {
            getAccessToken(token);
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
            setIsLoggedIn(true); // 액세스 토큰을 받으면 로그인 상태로 변경합니다.
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
            setIsLoggedIn(false); // 로그아웃 시 로그인 상태를 false로 변경합니다.
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
