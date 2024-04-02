// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Layout from './layouts/Layout';
import 문제만들기 from "./Tabs/make_ploblem"

function App() {  //라우터는 제가 연습삼아 참고의 의미를 넣어놨어요. 나중에 수정할게요
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />} />
        <Route path="/MakePloblem" element={<문제만들기 />} />
      </Routes>
    </Router>
  );
}
export default App;
