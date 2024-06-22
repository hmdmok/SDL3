import React from "react";
import { Form } from "react-bootstrap";

function RadioGroup({ name, items, onChange, value, desabled }) {
  return (
    <>
      {items.map((item) => (
        <div key={item.value}>
          <Form.Check
            type="radio"
            name={name}
            className="d-flex flex-row-reverse p-1"
            value={item.value}
            id={name + item.value}
            checked={item.value === value}
            onChange={onChange}
            disabled={desabled}
          />
          <Form.Label
            className="d-flex justify-content-center p-1"
            htmlFor={name + item.value}
          >
            {item.label}
          </Form.Label>
        </div>
      ))}
    </>
  );
}

export default RadioGroup;
