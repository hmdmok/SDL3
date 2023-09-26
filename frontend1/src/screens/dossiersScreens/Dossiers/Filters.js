import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import { isValidDate } from "../../../Functions/functions";
import { useDispatch, useSelector } from "react-redux";
import { listDossiersAction } from "../../../actions/dossierActions";

const Filters = () => {
  const dispatch = useDispatch();

  const [dossiersCount, setDossiersCount] = useState(50);
  const [search, setSearch] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [lastNameSearch, setLastNameSearch] = useState("");
  const [birthDateSearch, setBirthDateSearch] = useState("");
  const [fromDate, setFromDate] = useState(
    new Date("01/01/1900").toLocaleDateString()
  );
  const [toDate, setToDate] = useState(new Date().toLocaleDateString());

  const dossierDelete = useSelector((state) => state.dossierDelete);
  const {
    success: successDossierDelete,
  } = dossierDelete;

  useEffect(() => {
    dispatch(
      listDossiersAction(
        dossiersCount,
        search,
        lastNameSearch,
        nameSearch,
        birthDateSearch,
        fromDate,
        toDate
      )
    );
  }, [
    dispatch,
    successDossierDelete,
    search,
    lastNameSearch,
    nameSearch,
    birthDateSearch,
    dossiersCount,
    fromDate,
    toDate,
  ]);

  return (
    <div className="filters">
      <h4>{"ادوات البحث"}</h4>
      <hr />
      <Form.Label>{"عدد الملفات للبحث"}</Form.Label>
      <Form.Control
        type="search"
        defaultValue={dossiersCount}
        aria-label="Search"
        onChange={(e) => {
          setDossiersCount(e.target.value);
        }}
        className="m-1  text-right"
      />

      <Form.Label htmlFor="inputFromDate">{"من"}</Form.Label>
      <Form.Control
        value={new Date(fromDate)?.toISOString().split("T")[0]}
        name="fromDate"
        onChange={(e) => {
          if (isValidDate(e.target.value))
            setFromDate(new Date(e.target.value).toLocaleDateString());
        }}
        type="date"
        id="inputFromDate"
        className="m-1  text-right"
      />

      <Form.Label htmlFor="inputToDate">{"الى"}</Form.Label>
      <Form.Control
        value={new Date(toDate)?.toISOString().split("T")[0]}
        name="toDate"
        onChange={(e) => {
          if (isValidDate(e.target.value))
            setToDate(new Date(e.target.value).toLocaleDateString());
        }}
        type="date"
        id="inputToDate"
        className="m-1  text-right"
      />

      {!nameSearch && !lastNameSearch && !birthDateSearch && (
        <Form.Control
          type="search"
          placeholder="ادخل رقم الملف للبحث"
          className="m-1 text-right"
          aria-label="Search"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
      )}

      {!search && (
        <>
          <Form.Control
            type="search"
            placeholder="ادخل اسم الشخص للبحث"
            className="m-1  text-right"
            aria-label="NameSearch"
            onChange={(e) => {
              setNameSearch(e.target.value);
            }}
          />
          <Form.Control
            type="search"
            placeholder="ادخل لقب الشخص للبحث"
            className="m-1  text-right"
            aria-label="lastNameSearch"
            onChange={(e) => {
              setLastNameSearch(e.target.value);
            }}
          />
          <Form.Control
            type="search"
            placeholder="ادخل تاريخ ميلاد الشخص للبحث"
            className="m-1  text-right"
            aria-label="birthDateSearch"
            onChange={(e) => {
              setBirthDateSearch(e.target.value);
            }}
          />
        </>
      )}
    </div>
  );
};

export default Filters;
