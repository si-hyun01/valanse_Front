import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import NoticeBoard from '../src/Tabs/notinoti';
import NoticeWrite from '../src/Tabs/noti_write'; // NoticeWrite 컴포넌트 가져오기
import Mypage from '../src/layouts/Mypage';
import Header from '../src/layouts/Header';
import MakeProblem from '../src/Tabs/make_ploblem';
import ProblemUI from '../src/Tabs/Category/Problem_UI_Omaju';
import Entire from '../src/Tabs/entire';
import Popularity from '../src/Tabs/popularity';

function App() {
  const appStyle = {
    backgroundColor: 'black',
    minHeight: '100vh',
    color: 'white',
  };

  return (
    <Router>
      <div style={appStyle}>
        <Header />
        <Routes>
          <Route path="/" element={<Layout><Entire /></Layout>} />
          <Route path="/mypage" element={<Layout><Mypage /></Layout>} />
          <Route path="/category/:categoryName" element={<Layout><ProblemUI /></Layout>} />
          <Route path="/category/:categoryName/:quizId" element={<Layout><ProblemUI /></Layout>} />
          <Route path="/problems/:categoryName" element={<Layout><ProblemUI /></Layout>} />
          <Route path="/notice" element={<Layout><NoticeBoard /></Layout>} />
          <Route path="/noti_write" element={<Layout><NoticeWrite /></Layout>} />
          <Route path="/popularity" element={<Layout><Popularity /></Layout>} />
          <Route path="/problems" element={<Layout><MakeProblem /></Layout>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
