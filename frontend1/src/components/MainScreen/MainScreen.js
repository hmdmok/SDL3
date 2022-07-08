import React from "react";
import { Container, Row } from "react-bootstrap";
import "./MainScreen.css";

function MainScreen({ title, children }) {
  return (
    <div className="mainback">
      <Container>
        <Row>
          <div className="page">
            {title && (
              <span>
                <h1 className="d-flex flex-row-reverse heading">{title}</h1>
                <hr />
              </span>
            )}
            {children}
          </div>
        </Row>
      </Container>
    </div>
  );
}

export default MainScreen;
