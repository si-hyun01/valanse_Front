// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Layout from './layouts/Layout';
import 문제만들기 from "./Tabs/make_ploblem"
import 공지게시판 from "./Tabs/notinoti"
import 공지작성페이지 from "./Tabs/noti_write"

function App() {  //라우터는 제가 연습삼아 참고의 의미를 넣어놨어요. 나중에 수정할게요
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/MakePloblem" element={<문제만들기 />} />
        <Route path="/notinoti" element={<공지게시판 />} />
        <Route path="/noti_write" element={<공지작성페이지 />} />
      </Routes>
    </Router>
  );
}
export default App;
