import React from "react";
import { Container, Row } from "react-bootstrap";
import "./MainScreen.css";

function MainScreen({ title, children }) {
  return (
    <div className="mainback">
      <div className="page">
        {title && (
          <span>
            <h3 className="">{title}</h3>
            <hr />
          </span>
        )}
      </div>
      <div className="home">{children}</div>
    </div>
  );
}

export default MainScreen;
