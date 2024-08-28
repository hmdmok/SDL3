import React from "react";
import { Form } from "react-bootstrap";

function MultiTextInput({ label, others, name, errors }) {
  return (
    <div>
      <Form.Label htmlFor={name}>{label}</Form.Label>
      <Form.Control
        type="text"
        id={name}
        className="text-right"
        {...others(name, {
          pattern: {
            value: /^[\u0600-\u06FF0-9\s]+$/,
            message: "يرجى ادخال حروف عربية فقط",
          },
        })}
      />
      {errors[name] && (
        <p className="text-danger text-right">{errors[name].message}</p>
      )}
      <Form.Control
        type="text"
        id={`${name}_fr`}
        className="text-right"
        placeholder={`${label} باللاتينية`}
        {...others(`${name}_fr`, {
          required: `الرجاء ادخال ${label} باللاتينية`,
          pattern: {
            value: /^[A-Za-zÀ-ÖØ-öø-ÿ-Z0-9\s]+$/,
            message: "يرجى ادخال حروف لاتينية فقط",
          },
        })}
      />
      {errors[`${name}_fr`] && (
        <p className="text-danger text-right">{errors[`${name}_fr`].message}</p>
      )}
    </div>
  );
}

export default MultiTextInput;
