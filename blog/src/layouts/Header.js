import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SignUpmodel from "../modal/SignUpmodel";
import Cookies from 'js-cookie';
import valanse_logo from "./img/valanse_logo3.png";

const Header = () => {
    const [showSignUpModal, setShowSignUpModal] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [stateToken, setStateToken] = useState('');
    const [accessToken, setAccessToken] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Seoul', hour12: true, hourCycle: 'h12' }));
    const [userId, setUserId] = useState(''); // 추가: userid 상태 추가
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

        const refreshToken = Cookies.get('refresh_token');
        if (refreshToken) {
            refreshAccessToken(refreshToken);
        }

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
            setCurrentTime(new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Seoul', hour12: true, hourCycle: 'h12' }));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const accessTokenCookie = Cookies.get('access_token');
        if (accessTokenCookie) {
            const tokenPayload = accessTokenCookie.split('.')[1]; // 토큰의 payload 부분 가져오기
            const decodedPayload = JSON.parse(atob(tokenPayload)); // Base64 디코딩 및 JSON 파싱
            const userId = decodedPayload.userid; // 페이로드에서 userid 추출
            setUserId(userId);
        }
    }, [accessTokenCookie]); // accessTokenCookie를 의존성 배열에 추가
    

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
            backgroundColor: '#333' //연한 검은색
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
                                <div style={{ color: 'white', marginRight: '10px' }}>
                                    현재 ID값은 {userId} 입니다.
                                </div>
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
