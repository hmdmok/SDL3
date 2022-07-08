import React from "react";
import { Col, Container, Row } from "react-bootstrap";

function Footer() {
  return (
    <footer
      style={{
        with: "100%",
        position: "relative",
        bottom: 0,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Container>
        <Row>
          <Col className="text-center py-3">HMDMOK &copy; 2022</Col>
        </Row>
      </Container>
    </footer>
  );
}

export default Footer;
