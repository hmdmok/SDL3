import React from "react";
import { Form } from "react-bootstrap";

function RadioGroup({ label, name, items, onChange, errors, desabled }) {
  return (
    <>
      <Form.Label>{label}</Form.Label>
      <br />
      {items.map((item) => (
        <div key={item.value}>
          <Form.Check
            type="radio"
            className="d-flex flex-row-reverse"
            value={item.value}
            id={name + item.value}
            {...onChange(name)}
          />
          <Form.Label
            className="d-flex flex-row-reverse mx-5"
            htmlFor={name + item.value}
          >
            {item.label}
          </Form.Label>
        </div>
      ))}
      {errors[name] && (
        <p className="text-danger text-right">{errors[name].message}</p>
      )}
    </>
  );
}

export default RadioGroup;
