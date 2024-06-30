import React from "react";
import { Form } from "react-bootstrap";
import { isValidDate } from "../../../Functions/functions";
import RadioGroup from "../../../Functions/RadioGroup";
import Sort from "./Sort";

const Filters = ({
  limit,
  setLimit,
  setSearch,
  setDateEtude,
  setP_m_35_de,
  setP_m_35_dd,
  setSituationFamiliale,
  setFromDate,
  setToDate,
  fromDate,
  toDate,
  p_m_35_de,
  p_m_35_dd,
  dateEtude,
  sort,
  setSort,
}) => {
  const PlusMoinRadioItems = [
    { value: "p", label: "اكثر من 35 سنة من تاريخ الدراسة" },
    { value: "m", label: "اقل من 35 سنة من تاريخ الدراسة" },
  ];

  const PlusMoinDDRadioItems = [
    { value: "p", label: "اكثر من 35 سنة من تاريخ الايداع" },
    { value: "m", label: "اقل من 35 سنة من تاريخ الايداع" },
  ];

  return (
    <div className="filters">
      <hr />
      <Form.Label>{"عدد الملفات في الصفحة"}</Form.Label>
      <Form.Control
        size="sm"
        type="search"
        defaultValue={limit}
        aria-label="Search"
        onChange={(e) => {
          setLimit(e.target.value);
        }}
        className="m-1  text-right"
      />

      <Form.Label>{"للبحث"}</Form.Label>
      <Form.Control
        size="sm"
        type="search"
        placeholder="البحث"
        className="m-1 text-right"
        aria-label="Search"
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
      <div style={{ display: 0 }}>
        <Form.Label>{"تاريخ الدراسة"}</Form.Label>
        <Form.Control
          size="sm"
          type="date"
          className="m-1"
          onChange={(e) => {
            setDateEtude(e.target.value);
          }}
        />

        <RadioGroup
          name="plusMoin35DE"
          items={PlusMoinRadioItems}
          value={p_m_35_de}
          onChange={(e) => {
            setP_m_35_de(e.target.value);
          }}
          desabled={dateEtude === ""}
        />
      </div>

      <RadioGroup
        name="plusMoin35DD"
        items={PlusMoinDDRadioItems}
        value={p_m_35_dd}
        onChange={(e) => {
          setP_m_35_dd(e.target.value);
        }}
      />
      <Sort
        sort={sort}
        setSort={(sort) => {
          setSort(sort);
        }}
      />
      <Form.Check
        name="situation_f"
        size="sm"
        type="radio"
        id={`situation_f-1`}
        className="d-flex flex-row-reverse p-1"
        onChange={() => {
          setSituationFamiliale("");
        }}
      />
      <Form.Label
        htmlFor="situation_f"
        className="d-flex justify-content-center p-1"
      >
        {"الكل"}
      </Form.Label>
      <Form.Check
        name="situation_f"
        size="sm"
        type="radio"
        id={`situation_f-2`}
        className="d-flex flex-row-reverse p-1"
        onChange={() => {
          setSituationFamiliale("C");
        }}
      />
      <Form.Label
        htmlFor="situation_f"
        className="d-flex justify-content-center p-1"
      >
        {"اعزب"}
      </Form.Label>
      <Form.Check
        name="situation_f"
        size="sm"
        type="radio"
        id={`situation_f-3`}
        className="d-flex flex-row-reverse p-1"
        onChange={() => {
          setSituationFamiliale("M");
        }}
      />
      <Form.Label
        htmlFor="situation_f"
        className="d-flex justify-content-center p-1"
      >
        {"متزوج"}
      </Form.Label>
      <Form.Check
        name="situation_f"
        size="sm"
        type="radio"
        id={`situation_f-4`}
        className="d-flex flex-row-reverse p-1"
        onChange={() => {
          setSituationFamiliale("D");
        }}
      />
      <Form.Label
        htmlFor="situation_f"
        className="d-flex justify-content-center p-1"
      >
        {"مطلق"}
      </Form.Label>
      <Form.Check
        name="situation_f"
        size="sm"
        type="radio"
        id={`situation_f-5`}
        className="d-flex flex-row-reverse p-1"
        onChange={() => {
          setSituationFamiliale("V");
        }}
      />
      <Form.Label
        htmlFor="situation_f"
        className="d-flex justify-content-center p-1"
      >
        {"ارمل"}
      </Form.Label>
      <Form.Label htmlFor="inputFromDate">{"من"}</Form.Label>
      <Form.Control
        value={fromDate}
        name="fromDate"
        onChange={(e) => {
          if (isValidDate(e.target.value))
            setFromDate(new Date(e.target.value).toLocaleDateString());
        }}
        size="sm"
        type="date"
        id="inputFromDate"
        className="m-1  text-right"
      />
      <Form.Label htmlFor="inputToDate">{"الى"}</Form.Label>
      <Form.Control
        value={toDate}
        name="toDate"
        onChange={(e) => {
          if (isValidDate(e.target.value))
            setToDate(new Date(e.target.value).toLocaleDateString());
        }}
        size="sm"
        type="date"
        id="inputToDate"
        className="m-1  text-right "
      />
    </div>
  );
};

export default Filters;
