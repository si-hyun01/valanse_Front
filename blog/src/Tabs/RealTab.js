import React from 'react';
import { useNavigate } from 'react-router-dom';
import Soccer_Image from '../layouts/img/SoccerImage.jpg';
import Food_Image from '../layouts/img/FoodImage.jpg';
import Love_Image from '../layouts/img/LoveImage.png';
import Song_Image from '../layouts/img/SongImage.png';
import Actor_Image from '../layouts/img/actor.png';
import Survival_Image from '../layouts/img/Survival.jpg';
import Daily_Image from '../layouts/img/DailyImage.jpg';

const Tabs = ({ activeTab, onTabChange, onCategorySelect, isCategoryOpen, onCategoryToggle, selectedCategory }) => {
    const navigate = useNavigate();
    const categories = [
        { name: '축구', image: Soccer_Image },
        { name: '음식', image: Food_Image },
        { name: '연애', image: Love_Image },
        { name: '노래', image: Song_Image },
        { name: '생존', image: Survival_Image },
        { name: '드라마&영화', image: Actor_Image },
        { name: '일상', image: Daily_Image },
    ];

    const renderCategoryButtons = () => {
        return categories.map((category, index) => (
            <li key={index} className="col-4 mb-3 d-flex flex-column align-items-center">
                <button
                    onClick={() => onCategorySelect(category.name)}
                    style={{ background: 'black', padding: 0, border: 'none' }}
                >
                    <div style={{ width: '150px', height: '150px', overflow: 'hidden' }}>
                        <img src={category.image} alt={category.name} style={{ width: '100%', height: '150px' }} />
                    </div>
                    <span style={{ color: 'white' }}>{category.name}</span>
                </button>
            </li>
        ));
    };

    return (
        <div style={{ backgroundColor: 'black', backgroundSize: 'cover' }}>
            <div style={{ backgroundColor: 'black', backgroundSize: 'cover', display: 'flex', flexDirection: 'column', alignItems: 'center', border: '1px solid white' }}>
                <ul className="nav nav-tabs" style={{ border: 'none' }}>
                    <li className="nav-item" style={{ width: '230px' }}>
                        <button
                            className={`nav-link ${activeTab === '전체' && 'active'}`}
                            style={{
                                width: '100%',
                                backgroundColor: activeTab === '전체' ? 'rgba(0, 0, 255, 0.3)' : 'initial',
                                fontWeight: 'bold',
                                color: 'white',
                                borderRadius: '0', // 사각형으로 만들기 위해 borderRadius를 0으로 설정
                                height: '50px',
                                fontSize: '20px',
                                border: 'none'
                            }}
                            onClick={() => onTabChange('전체')}
                        >
                            전체
                        </button>
                    </li>
                    <li className="nav-item" style={{ width: 230 }}>
                        <div className="position-relative" style={{ zIndex: 999 }}>
                            <button
                                className={`nav-link ${activeTab === '카테고리' && 'active'}`}
                                style={{
                                    width: '100%',
                                    backgroundColor: activeTab === '카테고리' ? 'rgba(0, 0, 255, 0.3)' : 'initial',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    borderRadius: '0', // 사각형으로 만들기 위해 borderRadius를 0으로 설정
                                    height: '50px',
                                    fontSize: '20px',
                                    border: 'none'
                                }}
                                onClick={onCategoryToggle}
                            >
                                카테고리
                            </button>
                            {isCategoryOpen && (
                                <div
                                    className="position-absolute p-2 rounded"
                                    style={{ top: '100%', left: 0, minWidth: '600px', background: '#333333' }}
                                >
                                    <ul className="list-unstyled m-0 d-flex flex-wrap">
                                        {renderCategoryButtons()}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </li>
                    <li className="nav-item" style={{ width: '230px' }}>
                        <button
                            className={`nav-link ${activeTab === '인기' && 'active'}`}
                            style={{
                                width: '100%',
                                backgroundColor: activeTab === '인기' ? 'rgba(0, 0, 255, 0.3)' : 'initial',
                                fontWeight: 'bold',
                                color: 'white',
                                borderRadius: '0', // 사각형으로 만들기 위해 borderRadius를 0으로 설정
                                height: '50px',
                                fontSize: '20px',
                                border: 'none'
                            }}
                            onClick={() => onTabChange('인기')}
                        >
                            인기
                        </button>
                    </li>
                    <li className="nav-item" style={{ width: '230px' }}>
                        <button
                            className={`nav-link ${activeTab === '문제 만들기' && 'active'}`}
                            style={{
                                width: '100%',
                                backgroundColor: activeTab === '문제 만들기'? 'rgba(0, 0, 255, 0.3)' : 'initial',
                                fontWeight: 'bold',
                                color: 'white',
                                borderRadius: '0', // 사각형으로 만들기 위해 borderRadius를 0으로 설정
                                height: '50px',
                                fontSize: '20px',
                                border: 'none'
                            }}
                            onClick={() => onTabChange('문제 만들기')}
                        >
                            문제 만들기
                        </button>
                    </li>
                    <li className="nav-item" style={{ width: '230px' }}>
                        <button
                            className={`nav-link ${activeTab === '공지' && 'active'}`}
                            style={{
                                width: '100%',
                                backgroundColor: activeTab === '공지' ? 'rgba(0, 0, 255, 0.3)' : 'initial',
                                fontWeight: 'bold',
                                color: 'white',
                                borderRadius: '0', // 사각형으로 만들기 위해 borderRadius를 0으로 설정
                                height: '50px',
                                fontSize: '20px',
                                border: 'none',
                            }}
                            onClick={() => onTabChange('공지')}
                        >
                            공지
                        </button>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Tabs;
