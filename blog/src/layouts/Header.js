import React, { useState, useEffect } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import valanse_logo from "./img/valanse_logo3.png";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SignUpmodel from "../modal/SignUpmodel";
import Cookies from 'js-cookie';

const Header = () => {
    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [stateToken, setStateToken] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('ko-KR', { timeZone: 'Asia/Seoul' }));
    const navigate = useNavigate();

    useEffect(() => {
        const accessTokenCookie = Cookies.get('access_token');
        setIsLoggedIn(accessTokenCookie ? true : false);

        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('stateToken');
        setStateToken(token);

        if (token) {
            getAccessToken(token);
        }

        // 액세스 토큰이 만료되었을 때 갱신 토큰을 사용하여 새 액세스 토큰을 가져오는 역할
        const refreshToken = Cookies.get('refresh_token');
        if (refreshToken) {
            refreshAccessToken(refreshToken);
        }

        // axios 인터셉터 
        const interceptor = axios.interceptors.request.use(
            config => {
                const token = Cookies.get('access_token');
                if (token) {
                    config.headers['Authorization'] = token;
                }
                return config;
            },
            error => {
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(interceptor);
        };
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('ko-KR', { timeZone: 'Asia/Seoul' }));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const getAccessToken = async (stateToken) => {
        try {
            const response = await axios.post('https://valanse.site/token/get', null, {
                headers: {
                    'stateToken': stateToken,
                    'Content-Type': 'application/json'
                }
            });
            const token = response.data.data;
            setAccessToken(token);
            Cookies.set('access_token', token);
            setIsLoggedIn(true);
            window.location.replace('https://valanse.vercel.app/');
        } catch (error) {
            console.error('Error getting access token:', error.message);
        }
    };

    const refreshAccessToken = async (refreshToken) => {
        try {
            const response = await axios.post('https://valanse.site/token/refresh', null, {
                headers: {
                    'Authorization': refreshToken,
                    'Content-Type': 'application/json'
                }
            });
            const newToken = response.data.data;
            setAccessToken(newToken);
            Cookies.set('access_token', newToken);
        } catch (error) {
            console.error('Error refreshing access token:', error.message);
            // 필요에 따라 에러 처리, 예: 사용자 로그아웃
        }
    };

    const handleLogout = async () => {
        try {
            const accessTokenCookie = Cookies.get('access_token');
            if (accessTokenCookie) {
                await axios.post('https://valanse.site/token/logout', null, {
                    headers: {
                        'Authorization': accessTokenCookie,
                        'Content-Type': 'application/json'
                    }
                });
                Cookies.remove('access_token');
                Cookies.remove('refresh_token');
                setIsLoggedIn(false);
                setAccessToken('');
                setStateToken('');
                window.location.replace('https://valanse.vercel.app/');
            }
        } catch (error) {
            console.error('Error during logout:', error.message);
        }
    };

    const toggleSignUpModal = () => {
        setShowSignUpModal(!showSignUpModal);
    };

    const handleLogoClick = () => {
        window.location.href = 'https://valanse.vercel.app/';
    };

    return (
        <>
            <header>
                <Navbar bg="black" expand="lg">
                    <Container style={{ maxWidth: '80%' }}>
                        <Navbar.Brand onClick={handleLogoClick}>
                            <img
                                src={valanse_logo}
                                alt="Valanse Logo"
                                style={{ cursor: 'pointer', width: '250px', height: 'auto' }}
                            />
                        </Navbar.Brand>

                        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <div style={{
                                color: 'cyan',
                                fontSize: '24px',
                                fontWeight: 'bold',
                                textShadow: '0 0 10px cyan, 0 0 20px cyan, 0 0 30px cyan',
                            }}>
                                {currentTime}
                            </div>
                        </div>

                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
                            <Nav className="ml-auto">
                                {isLoggedIn ? (
                                    <>
                                        <Nav.Link>
                                            <Button variant="secondary" onClick={handleLogout}>로그아웃</Button>
                                        </Nav.Link>
                                        <Nav.Link as={Link} to="/mypage">
                                            <Button variant="secondary">마이페이지</Button>
                                        </Nav.Link>
                                    </>
                                ) : (
                                    <Nav.Link>
                                        <Button variant="secondary" onClick={toggleSignUpModal}>로그인</Button>
                                    </Nav.Link>
                                )}
                                <SignUpmodel show={showSignUpModal} onHide={toggleSignUpModal} />
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </header>
        </>
    );
};

export default Header;
