import React from "react";
import { Form } from "react-bootstrap";

function SelectGroup({ label, name, others, items,errors }) {
  return (
    <div>
      <Form.Label htmlFor={name}>{label}</Form.Label>
      <Form.Select
        id={name}
        className="text-right"
        {...others(name, {
          required: `الرجاء اختيار ${label}`,
          validate: (fieldValue) =>
            fieldValue !== -1 || `الرجاء اختيار ${label}`,
        })}
      >
        <option value="-1" disabled hidden>
          اختر {label}
        </option>
        {items?.map((item) => (
          <option key={name + item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </Form.Select>
      {errors[name] && (
        <p className="text-danger text-right">{errors[name].message}</p>
      )}
    </div>
  );
}

export default SelectGroup;
