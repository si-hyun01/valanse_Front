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
    const [expiration, setExpiration] = useState(null);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Seoul', hour12: true, hourCycle: 'h12' }));
    const [errorStatus, setErrorStatus] = useState('');

    // 페이지 로드 시 로그인 상태 확인
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

        // Cleanup 함수
        return () => {
            // 여기에 cleanup 코드 추가 (axios interceptors 제거)
        };
    }, []);

    // 페이지 로드 시 현재 시각 표시
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('en-US', { timeZone: 'Asia/Seoul', hour12: true, hourCycle: 'h12' }));
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Access Token 유효 기간 체크 함수
    const checkTokenExpiration = async () => {
        try {
            const accessToken = Cookies.get('access_token');
            const response = await axios.post('https://valanse.site/token/check/expiration', null, {
                headers: {
                    'Authorization': accessToken,
                    'accept': 'application/json;charset=UTF-8'
                }
            });
            setExpiration(response.data.data);
            console.log('Token expiration:', response.data);
        } catch (error) {
            console.error('Error checking token expiration:', error.message);
            if (error.response && error.response.status === 401 && error.response.data === "Access Token 만료!") {
                const refreshToken = Cookies.get('refresh_token');
                if (refreshToken) {
                    try {
                        await refreshAccessToken(refreshToken);
                        await checkTokenExpiration(); 
                    } catch (refreshError) {
                        console.error('Error refreshing access token:', refreshError.message);
                        handleLogout();
                    }
                } else {
                    handleLogout();
                }
            } else {
                setErrorStatus('다시 로그인이 필요합니다.'); // 다른 상황에 맞는 메시지 설정
            }
        }
    };

    // Access Token 발급 함수
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

    // Access Token 갱신 함수
    const refreshAccessToken = async (refreshToken) => {
        try {
            const response = await axios.post('https://valanse.site/token/refresh', null, {
                headers: {
                    'Authorization': refreshToken,
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                const newToken = response.data.data;
                setAccessToken(newToken);
                Cookies.set('access_token', newToken);
            } else {
                console.error('Refresh token renewal required.');
                setErrorStatus('다시 로그인이 필요합니다.'); // 다른 상황에 맞는 메시지 
            }
        } catch (error) {
            console.error('Error refreshing access token:', error.message);
            throw error;
        }
    };

    // 로그아웃 처리 함수
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

    // 로그인 모달 토글 함수
    const toggleSignUpModal = () => {
        setShowSignUpModal(!showSignUpModal);
    };

    // 로고 클릭 처리 함수
    const handleLogoClick = () => {
        window.location.href = 'https://valanse.vercel.app/';
    };

    // 버튼 스타일 정의
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
                            <div>
                                <div style={{ marginBottom: '10px', color: 'red' }}>{errorStatus}</div>
                                <button
                                    style={{ ...buttonStyles.base, ...buttonStyles.login }}
                                    onClick={toggleSignUpModal}
                                >
                                    로그인
                                </button>
                            </div>
                        )}
                        <SignUpmodel show={showSignUpModal} onHide={toggleSignUpModal} />
                    </div>
                </div>
            </header>
        </>
    );
};

export default Header;
