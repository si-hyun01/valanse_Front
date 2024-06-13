import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Tabs from './Tabs';
import Footer from './Footer';
import ProblemUI from './ProblemUI';  // ProblemUI 컴포넌트 임포트

const Layout = ({ children }) => {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [activeTab, setActiveTab] = useState('전체');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const navigate = useNavigate();
  const { categoryName } = useParams();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.category-dropdown')) {
        setIsCategoryOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (categoryName) {
      setSelectedCategory(categoryName);
      setActiveTab(categoryName);
    } else {
      setSelectedCategory('');
      setActiveTab('전체');
    }
  }, [categoryName]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(tab === '전체' ? '/' : `/${tab.toLowerCase()}`);
  };

  const handleCategoryToggle = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setActiveTab(category);
    setIsCategoryOpen(false);
    navigate(`/category/${category}`);
  };

  return (
    <>
      <Tabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        onCategorySelect={handleCategorySelect}
        isCategoryOpen={isCategoryOpen}
        onCategoryToggle={handleCategoryToggle}
        selectedCategory={selectedCategory}
      />
      {selectedCategory ? (
        <ProblemUI categoryName={selectedCategory} />
      ) : (
        children
      )}
      <Footer />
    </>
  );
};

export default Layout;
