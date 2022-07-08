import React from "react";
import "./LandingPage.css";
import logoPic from "../../apartment.png";

import { Col, Container, Row } from "react-bootstrap";
import Logo from "../../components/Logo/Logo";

const LandingPage = () => {
  return (
    <div className="main">
      <Container>
        <Row>
          <div className="intro-text">
            <div>
              <h1 className="title">مرحبا بكم في تطبيق متابعة ملفات السكن</h1>
              <p className="subtitle">
                هذا التطبيق مخصص للموظفين المعنيين بمتابعة ملفات السكن لتسهيل
                مهامهم.
              </p>
            </div>
          </div>
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
