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
            className="d-flex flex-row-reverse"
            value={item.value}
            id={name + item.value}
            checked={item.value === value}
            onChange={onChange}
            disabled={desabled}
          />
          <Form.Label
            className="d-flex flex-row-reverse mx-5"
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
