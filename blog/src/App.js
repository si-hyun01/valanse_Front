import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layouts/Layout';
import NoticeBoard from '../src/Tabs/notinoti';
import NoticeWrite from '../src/Tabs/noti_write';
import Mypage from '../src/layouts/Mypage';
import ProblemUI from '../src/Tabs/Category/Problem_UI_Omaju';

function App() {
  const userId = ''; // userId 설정

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout activeTab="전체" />} />
        <Route path="/category/:categoryName" element={<Layout />} />
        <Route path="/problems" element={<Layout />} />
        <Route path="/notice" element={<Layout />} />
        <Route path="/write-notice" element={<Layout />} />
        <Route path="/popularity" element={<Layout />} />
        <Route path="/noti_board" element={<NoticeBoard />} />
        <Route path="/noti_write" element={<NoticeWrite />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/problemui/:categoryName" element={<ProblemUI userId={userId} />} /> {/* userId 전달 */}
      </Routes>
    </Router>
  );
}

export default App;
