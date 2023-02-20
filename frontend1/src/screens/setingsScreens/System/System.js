import React, { useEffect, useState } from "react";
import { Button, Card, Container, Form, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ErrorMessage from "../../../components/ErrorMessage";
import Loading from "../../../components/Loading";
import MainScreen from "../../../components/MainScreen/MainScreen";
import { listWilayasAction } from "../../../actions/wilayaActions";
import { listCommunesByWilayaAction } from "../../../actions/communeActions";

function System() {
  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [selectedCommune, setSelectedCommune] = useState("");
  const [wilayasList, setWilayasList] = useState([]);
  const [communesList, setCommunesList] = useState([]);
  const [typeAdmin, setTypeAdmin] = useState("");
  const dispatch = useDispatch();

  const wilayaList = useSelector((state) => state.wilayaList);
  const { loading, wilayas, error } = wilayaList;

  const communeGetByWilaya = useSelector((state) => state.communeGetByWilaya);
  const {
    loading: loadingCommunes,
    communes,
    error: errorCommunes,
  } = communeGetByWilaya;

  useEffect(() => {
    dispatch(listWilayasAction());
  }, [dispatch]);

  useEffect(() => {
    if (wilayas?.length > 0) {
      setWilayasList(wilayas);
    }
  }, [wilayas]);

  useEffect(() => {
    if (communes?.length > 0) {
      setCommunesList(communes);
    }
  }, [communes]);

  useEffect(() => {
    dispatch(listCommunesByWilayaAction(selectedWilaya));
  }, [dispatch, selectedWilaya]);

  useEffect(() => {
    console.log(selectedCommune);
  }, [selectedCommune]);

  const selectTypeAdmin = (wil_n) => {
    setTypeAdmin(wil_n);
    console.log(wil_n);
  };

  const readWilaya = (wilayaMap) => {
    return (
      <select
        onChange={(e) => setSelectedWilaya(e.target.value)}
        id="wil_n"
        className="form-control text-right"
        name="wil_n"
        defaultValue="-1"
        required
      >
        <option value="-1" disabled hidden>
          اختر الولاية
        </option>
        {wilayaMap?.map((wilaya) => (
          <option key={wilaya._id} value={wilaya.code}>
            {wilaya.nomAr}
          </option>
        ))}
      </select>
    );
  };

  const readCommune = (communes) => {
    return (
      <select
        onChange={(e) => setSelectedCommune(e.target.value)}
        id="comm_n"
        className="form-control text-right"
        name="comm_n"
        defaultValue="-1"
        required
      >
        <option value="-1" disabled hidden>
          اختر البلدية
        </option>
        {communes?.map((commune) => (
          <option key={commune._id} value={commune.code}>
            {commune.nomAr}
          </option>
        ))}
      </select>
    );
  };

  return (
    <MainScreen title={"اعدادات تثبيت التطبيقة"}>
      {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
      {loading && <Loading />}
      {errorCommunes && (
        <ErrorMessage variant="danger">{errorCommunes}</ErrorMessage>
      )}
      {loadingCommunes && <Loading />}
      <div>
        <Card.Header className="form-control text-right">الادارة</Card.Header>
        <Card.Body>
          <select
            onChange={(e) => selectTypeAdmin(e.target.value)}
            id="typeAdmin"
            className="form-control text-right"
            name="typeAdmin"
            defaultValue="-1"
            required
          >
            <option value="-1" disabled hidden>
              اختر الادارة
            </option>

            <option key={"01"} value={"daira"}>
              {"دائرة"}
            </option>
            <option key={"02"} value={"commune"}>
              {"بلدية"}
            </option>
          </select>
        </Card.Body>
        {typeAdmin !== "" && (
          <div>
            <Card.Header className="form-control text-right">
              اختار الولاية
            </Card.Header>
            <Card.Body>{readWilaya(wilayasList)}</Card.Body>
          </div>
        )}
        {typeAdmin === "commune" && (
          <div>
            <Card.Header className="form-control text-right">
              اختار البلدية
            </Card.Header>
            <Card.Body>{readCommune(communesList)}</Card.Body>
          </div>
        )}
        {typeAdmin === "daira" && (
          <div>
            <Card.Header className="form-control text-right">
              اختار الدائرة
            </Card.Header>
            <Card.Body>{readWilaya(wilayaList)}</Card.Body>
          </div>
        )}
      </div>
    </MainScreen>
  );
}

export default System;
