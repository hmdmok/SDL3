import React from "react";
import { Alert } from "react-bootstrap";

function Message({ variant = "success", children }) {
  return (
    <Alert variant={variant}>
      <strong>{children}</strong>
    </Alert>
  );
}

export default Message;
