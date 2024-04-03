import React, { useState } from "react";
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import valanse_logo from "./img/valanse_logo.png";
import SignUpmodel from "../modal/SignUpmodel";


const Header = () => {
    const [SignUpmodelOn, setSignUpModalOn] = useState(false);
    return (
        <>
            <SignUpmodel show={SignUpmodelOn} onHide={() => setSignUpModalOn(false)} />
            <header>
                <Navbar bg="light" expand="lg">
                    <Container>
                        <Navbar.Brand>
                                <img src={valanse_logo} alt="노이즈 로고" />
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls="basic-navbar-nav" />
                        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">  {/*회원가입과 로그인 버튼을 오른쪽으로 정렬하는 거에요*/}
                            <Nav className="ml-auto">
                                <Nav.Link>
                                    <Button variant="primary">로그인</Button>
                                </Nav.Link>
                                <Nav.Link>
                                    <Button variant="secondary"
                                        onClick={() => setSignUpModalOn(true)}>회원가입</Button> {/*여기서 true는 회원가입 버튼 눌렀을 때 true되어서 회원가입 팝업창이 뜸*/}
                                </Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
            </header>
        </>
    );
};

export default Header;