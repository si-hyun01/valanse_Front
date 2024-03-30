import { Container } from "react-bootstrap";
import Layout from "./layouts/Layout";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PopularTab from './Tabs/Popular';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Container style={{ minHeight: "80vh" }}>App</Container>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
