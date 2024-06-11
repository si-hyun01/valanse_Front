// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import NoticeBoard from '../src/Tabs/notinoti';
import NoticeWrite from '../src/Tabs/noti_write';
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
        <Route path="/category/:categoryName" element={<Layout />} />
        <Route path="/problems/:categoryName" element={<ProblemUI />} />
        <Route path="/notice" element={<Layout />} />
        <Route path="/write-notice" element={<Layout />} />
        <Route path="/popularity" element={<Layout />} />
        <Route path="/problems" element={<Layout />} />
        <Route path="/mypage" element={<Mypage />} />
      </Routes>
    </Router>
  );
}

export default App;
