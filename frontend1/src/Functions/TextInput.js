import React from "react";
import { Form } from "react-bootstrap";

function TextInput({ label, others, name, type, errors }) {
  return (
    <div>
      <Form.Label htmlFor={name}>{label}</Form.Label>
      <Form.Control
        type={type}
        id={name}
        className="text-right"
        {...others(name)}
      />
      {errors[name] && (
        <p className="text-danger text-right">{errors[name].message}</p>
      )}
    </div>
  );
}

export default TextInput;
