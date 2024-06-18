import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Tabs from '../Tabs/RealTab';
import Footer from './Footer';

const Layout = ({ children }) => {
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
        } else if (tab === '추천 문제') {
            navigate('/recommended');
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

    return (
        <div>
            <Tabs 
                activeTab={activeTab}
                onTabChange={handleTabChange}
                onCategorySelect={handleCategorySelect}
                isCategoryOpen={isCategoryOpen}
                onCategoryToggle={handleCategoryToggle}
                selectedCategory={selectedCategory}
            />
            <div>
                {React.cloneElement(children, { categoryName: selectedCategory })}
            </div>
            <Footer />
        </div>
    );
};

export default Layout;
