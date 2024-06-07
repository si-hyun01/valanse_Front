import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import SignUpmodel from "../modal/SignUpmodel";
import Cookies from 'js-cookie';
import valanse_logo from "./img/valanse_logo3.png";

const Header = () => {
    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [stateToken, setStateToken] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [userId, setUserId] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Seoul', hour12: true, hourCycle: 'h12' }));
    const navigate = useNavigate();

    useEffect(() => {
        const accessTokenCookie = Cookies.get('access_token');
        setIsLoggedIn(accessTokenCookie ? true : false);

        if (accessTokenCookie) {
            const decodedToken = jwt_decode(accessTokenCookie);
            setUserId(decodedToken.user_id); // 또는 토큰 구조에 따라 userId 필드명을 수정
        }

        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('stateToken');
        setStateToken(token);

        if (token) {
            getAccessToken(token);
        }

        const refreshToken = Cookies.get('refresh_token');
        if (refreshToken) {
            refreshAccessToken(refreshToken);
        }

        const interceptor = axios.interceptors.request.use(
            config => {
                const token = Cookies.get('access_token');
                if (token) {
                    config.headers['Authorization'] = `Bearer ${token}`;
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
            setCurrentTime(new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Seoul', hour12: true, hourCycle: 'h12' }));
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
            const decodedToken = jwt_decode(token);
            setUserId(decodedToken.user_id); // 또는 토큰 구조에 따라 userId 필드명을 수정
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
            const decodedToken = jwt_decode(newToken);
            setUserId(decodedToken.user_id); // 또는 토큰 구조에 따라 userId 필드명을 수정
        } catch (error) {
            console.error('Error refreshing access token:', error.message);
        }
    };

    const handleLogout = async () => {
        try {
            const accessTokenCookie = Cookies.get('access_token');
            if (accessTokenCookie) {
                await axios.post('https://valanse.site/token/logout', null, {
                    headers: {
                        'Authorization': `Bearer ${accessTokenCookie}`,
                        'Content-Type': 'application/json'
                    }
                });
                Cookies.remove('access_token');
                Cookies.remove('refresh_token');
                setIsLoggedIn(false);
                setAccessToken('');
                setStateToken('');
                setUserId(null);
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

    const buttonStyles = {
        base: {
            padding: '10px 20px',
            border: '2px solid',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            margin: '0 10px',
            textShadow: '0 0 5px',
            color: '#fff',
            backgroundColor: '#333' // 연한 검은색
        },
        logout: {
            borderColor: 'red',
            boxShadow: '0 0 10px red'
        },
        myPage: {
            borderColor: 'green',
            boxShadow: '0 0 10px green'
        },
        login: {
            borderColor: 'blue',
            boxShadow: '0 0 10px blue'
        }
    };

    return (
        <>
            <header style={{ backgroundColor: 'black', padding: '10px 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '80%', margin: '0 auto' }}>
                    <div onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
                        <img
                            src={valanse_logo}
                            alt="Valanse Logo"
                            style={{ width: '250px', height: 'auto' }}
                        />
                    </div>

                    <div style={{ flex: 3.5, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{
                            padding: '10px 20px',
                            border: '3px solid cyan',
                            borderRadius: '10px',
                            boxShadow: '0 0 10px cyan',
                            display: 'inline-block',
                            width: '200px',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                color: 'cyan',
                                fontSize: '24px',
                                fontWeight: 'bold',
                                textShadow: '0 0 10px cyan, 0 0 20px cyan',
                                fontFamily: 'monospace'
                            }}>
                                {currentTime}
                            </div>
                        </div>
                    </div>

                    <div>
                        {isLoggedIn ? (
                            <>
                                <button
                                    style={{ ...buttonStyles.base, ...buttonStyles.logout }}
                                    onClick={handleLogout}
                                >
                                    로그아웃
                                </button>
                                <Link to="/mypage">
                                    <button
                                        style={{ ...buttonStyles.base, ...buttonStyles.myPage }}
                                    >
                                        마이페이지
                                    </button>
                                </Link>
                            </>
                        ) : (
                            <button
                                style={{ ...buttonStyles.base, ...buttonStyles.login }}
                                onClick={toggleSignUpModal}
                            >
                                로그인
                            </button>
                        )}
                        <SignUpmodel show={showSignUpModal} onHide={toggleSignUpModal} />
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
