// App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import NoticeBoard from '../src/Tabs/notinoti';
import NoticeWrite from '../src/Tabs/noti_write';
import Mypage from '../src/layouts/Mypage';
import Header from '../src/layouts/Header';
import makeproblem from '../src/Tabs/make_ploblem';
import ProblemUI from '../src/Tabs/Category/Problem_UI_Omaju';
import { useParams } from 'react-router-dom';

function App() {
  const [userId, setUserId] = useState('');

  const handleUserIdUpdate = (id) => {
    setUserId(id);
  };

  return (
    <Router>
      <Header onUserIdUpdate={handleUserIdUpdate} />
      <Routes>
        <Route path="/" element={<Layout activeTab="전체" />} />
        <Route path="/category/:categoryName" element={<Layout />} />
        <Route path="/problems/:categoryName" element={<ProblemUIWrapper />} />
        <Route path="/notice" element={<Layout />} />
        <Route path="/write-notice" element={<Layout />} />
        <Route path="/popularity" element={<Layout />} />
        <Route path="/problems" element={<Layout />} />
        <Route path="/popularity" element={<makeproblem />} />
        <Route path="/noti_board" element={<NoticeBoard />} />
        <Route path="/noti_write" element={<NoticeWrite />} />
        <Route path="/mypage" element={<Mypage />} />
      </Routes>
    </Router>
  );
}

function ProblemUIWrapper() {
  const { categoryName } = useParams();
  const [userId, setUserId] = useState('');

  const handleUserIdUpdate = (id) => {
    setUserId(id);
  };

  return <ProblemUI categoryName={categoryName} userId={userId} onUserIdUpdate={handleUserIdUpdate} />;
}

export default App;
