import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import NoticeBoard from '../src/Tabs/notinoti';
import NoticeWrite from '../src/Tabs/noti_write'; // NoticeWrite 컴포넌트 가져오기
import Mypage from '../src/layouts/Mypage';
import Header from '../src/layouts/Header';
import MakeProblem from '../src/Tabs/make_ploblem';
import ProblemUI from '../src/Tabs/Category/Problem_UI_Omaju';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Layout activeTab="전체" />} />
        <Route path="/mypage" element={<Mypage />} />
        <Route path="/category/:categoryName" element={<Layout />} />
        <Route path="/problems/:categoryName" element={<ProblemUI />} />
        <Route path="/notice" element={<Layout />} />
        <Route path="/noti_write" element={<NoticeWrite />} /> {/* NoticeWrite 페이지로 연결되는 경로 추가 */}
        <Route path="/popularity" element={<Layout />} />
        <Route path="/problems" element={<Layout />} />
      </Routes>
    </Router>
  );
}

export default App;
