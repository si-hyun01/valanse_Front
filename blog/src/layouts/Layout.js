import React from 'react';
import { Container } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Popularity from '../Tabs/popularity';
import Notice from '../Tabs/notinoti';
import Problem_UI from '../Tabs/Category/Problem_UI';
import Problem_UI_Omaju from '../Tabs/Category/Problem_UI_Omaju';
import Make_ploblem from '../Tabs/make_ploblem';
import Entire from '../Tabs/entire';
import Soccer_Image from './img/SoccerImage.jpg';
import Food_Image from './img/FoodImage.jpg';
import Love_Image from './img/LoveImage.png';
import Song_Image from './img/SongImage.png';
import Actor_Image from './img/actor.png';
import Survival_Image from './img/Survival.jpg';
import Daily_Image from './img/DailyImage.jpg';
import Background from './img/green_line.jpg'; // 배경은 이미지로 쓸지 말지 일단 지켜보고 놔둘게요

const Layout = () => {
    const navigate = useNavigate();
    const { categoryName } = useParams();
    const [selectedCategory, setSelectedCategory] = React.useState(categoryName || null);
    const [activeTab, setActiveTab] = React.useState('전체');
    const [isCategoryOpen, setCategoryOpen] = React.useState(false);

    React.useEffect(() => {
        const closeDropdown = (e) => {
            if (isCategoryOpen && !e.target.closest('.position-relative')) {
                setCategoryOpen(false);
            }
        };

        document.addEventListener('click', closeDropdown);

        return () => {
            document.removeEventListener('click', closeDropdown);
        };
    }, [isCategoryOpen]);

    React.useEffect(() => {
        if (categoryName) {
            setSelectedCategory(categoryName);
            setActiveTab('카테고리');
        }
    }, [categoryName]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        setSelectedCategory(null);
        if (tab === '전체') {
            navigate('/');
        } else if (tab === '문제 만들기') {
            navigate('/problems');
        } else if (tab === '공지') {
            navigate('/notice');
        } else if (tab === '인기') {
            navigate('/popularity');
        } else {
            navigate('/');
        }
    };

    const handleCategoryToggle = () => {
        setCategoryOpen(!isCategoryOpen);
    };

    const handleCategorySelect = (category) => {
        setSelectedCategory(category);
        setActiveTab('카테고리');
        setCategoryOpen(false);
        navigate(`/category/${category}`);
    };

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
                    onClick={() => handleCategorySelect(category.name)}
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
        <div>
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
                                onClick={() => handleTabChange('전체')}
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
                                    onClick={handleCategoryToggle}
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
                                onClick={() => handleTabChange('인기')}
                            >
                                인기
                            </button>
                        </li>
                        <li className="nav-item" style={{ width: '230px' }}>
                            <button
                                className={`nav-link ${activeTab === '문제 만들기' && 'active'}`}
                                style={{
                                    width: '100%',
                                    backgroundColor: activeTab === '문제 만들기'
                                        ? 'rgba(0, 0, 255, 0.3)' : 'initial',
                                    fontWeight: 'bold',
                                    color: 'white',
                                    borderRadius: '0', // 사각형으로 만들기 위해 borderRadius를 0으로 설정
                                    height: '50px',
                                    fontSize: '20px',
                                    border: 'none'
                                }}
                                onClick={() => handleTabChange('문제 만들기')}
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
                                onClick={() => handleTabChange('공지')}
                            >
                                공지
                            </button>
                        </li>
                    </ul>
                </div>

                <div>
                    {activeTab === '전체' && <Entire />}
                    {selectedCategory && (
                        <div>
                        {selectedCategory === '축구' && <Problem_UI_Omaju categoryName={selectedCategory} />}
                        {selectedCategory === '음식' && <Problem_UI_Omaju categoryName={selectedCategory} />}
                        {selectedCategory === '연애' && <Problem_UI_Omaju categoryName={selectedCategory} />}
                        {selectedCategory === '노래' && <Problem_UI_Omaju categoryName={selectedCategory} />}
                        {selectedCategory === '생존' && <Problem_UI_Omaju categoryName={selectedCategory} />}
                        {selectedCategory === '드라마&영화' && <Problem_UI_Omaju categoryName={selectedCategory} />}
                        {selectedCategory === '일상' && <Problem_UI_Omaju categoryName={selectedCategory} />}
                    </div>
                    )}
                    {activeTab === '인기' && <Popularity />}
                    {activeTab === '문제 만들기' && <Make_ploblem />}
                    {activeTab === '공지' && <Notice />}
                </div>
                <Footer />
            </div>
        </div>
    );
};

export default Layout;
