import React, { useEffect } from "react";
import "./LandingPage.css";
import logoPic from "../../apartment.png";
import { useNavigate } from "react-router-dom";
import { Card, Col, Container, Row } from "react-bootstrap";
import Logo from "../../components/Logo/Logo";

const LandingPage = () => {
  let history = useNavigate();
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      history("/home");
    }
  }, [history]);
  return (
    <div className="main">
      <Container >
        <Row className="d-flex justify-content-center">
          <div className="intro-text">
            <div>
              <h1 className="title">مرحبا بكم في تطبيق متابعة ملفات السكن</h1>
              <p className="subtitle">
                هذا التطبيق مخصص للموظفين المعنيين بمتابعة ملفات السكن لتسهيل
                مهامهم.
              </p>
            </div>
          </div>
          <Card  style={{ width: "17rem" }}>
            <Card.Header as="h3" className="text-center">
              يمكنكم التواصل معنا عبر هذه القنوات
            </Card.Header>
            <Card.Body>
              <Card.Title>العنوان تقرت</Card.Title>

              <Card.Title>+ 213 ** ** ** ** **</Card.Title>

              <a href="mailto:hmd.moknine@gmail.com">hmd.moknine@gmail.com</a>
            </Card.Body>
          </Card>
        </Row>
        <Row>
          <Col className="p-5 d-flex flex-column align-items-center">
            <Logo root="/login" title={"دخول"} pic={logoPic} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LandingPage;
