// Header.js

import React, { useState, useEffect } from "react";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import valanse_logo from "./img/valanse_logo.png";
import axios from 'axios';
import SignUpmodel from "../modal/SignUpmodel";

const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showSignUpModal, setShowSignUpModal] = useState(false);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            setIsLoggedIn(true);
        }
    }, []);

    const handleLogout = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            await axios.post('http://54.180.170.88:8080/token/logout', {}, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            setIsLoggedIn(false);
            localStorage.removeItem('accessToken');
        } catch (error) {
            console.error('로그아웃 중 에러 발생:', error);
        }
    };

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
