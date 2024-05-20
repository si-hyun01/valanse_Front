import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layouts/Layout';
import NoticeBoard from '../src/Tabs/notinoti';
import NoticeWrite from '../src/Tabs/noti_write';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/category/:categoryName" element={<Layout />} />
        <Route path="/problems" element={<Layout />} />
        <Route path="/notice" element={<Layout />} />
        <Route path="/write-notice" element={<Layout />} />
        <Route path="/popularity" element={<Layout />} />
        <Route path="/noti_board" element={<NoticeBoard />} />
        <Route path="/noti_write" element={<NoticeWrite />} />
      </Routes>
    </Router>
  );
}

export default App;
