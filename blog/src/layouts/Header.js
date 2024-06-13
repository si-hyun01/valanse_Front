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

        const requestInterceptor = axios.interceptors.request.use(
            config => {
                const token = Cookies.get('access_token');
                if (token) {
                    config.headers['Authorization'] = token;
                }
                return config;
            },
            error => Promise.reject(error)
        );

        const responseInterceptor = axios.interceptors.response.use(
            response => response,
            async error => {
                const originalRequest = error.config;
                if (error.response && error.response.status === 401 && error.response.data === "Access Token 만료!") {
                    const refreshToken = Cookies.get('refresh_token');
                    if (refreshToken) {
                        try {
                            await refreshAccessToken(refreshToken);
                            originalRequest.headers['Authorization'] = Cookies.get('access_token');
                            return axios(originalRequest);
                        } catch (refreshError) {
                            console.error('Error refreshing access token:', refreshError.message);
                            handleLogout();
                        }
                    } else {
                        handleLogout();
                    }
                } else if (error.response && error.response.status >= 400 && error.response.status < 500) {
                    // 4xx 에러가 발생한 경우
                    console.error('Authentication required:', error.message);
                    toggleSignUpModal();
                }
                return Promise.reject(error);
            }
        );

        return () => {
            axios.interceptors.request.eject(requestInterceptor);
            axios.interceptors.response.eject(responseInterceptor);
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
            setIsLoggedIn(true);
            
            // 상태 토큰을 URL에서 제거
            removeStateTokenFromURL();
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

            // 응답을 확인하여 처리
            if (response.status === 200) {
                const newToken = response.data.data;
                setAccessToken(newToken);
                Cookies.set('access_token', newToken);
            } else {
                // 4xx 응답이 오면 로그인 화면을 표시
                console.error('Refresh token renewal required.');
                toggleSignUpModal(); // 로그인 모달 열기 또는 다른 로그인 화면 표시 로직 추가
            }
        } catch (error) {
            console.error('Error refreshing access token:', error.message);
            throw error;
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
                // 로그아웃 시 URL에서 상태 토큰 제거 및 메인 페이지로 리디렉션
                removeStateTokenFromURL();
                navigate('/'); // 예시: 메인 페이지로 리디렉션
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
            backgroundColor: '#333'
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

    const removeStateTokenFromURL = () => {
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.delete('stateToken');
        const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
        window.history.replaceState({}, '', newUrl);
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
