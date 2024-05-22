import React, { useEffect, useState } from "react";
import { Button, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ErrorMessage from "../../../components/ErrorMessage";
import Loading from "../../../components/Loading";
import MainScreen from "../../../components/MainScreen/MainScreen";
import { listWilayasAction } from "../../../actions/wilayaActions";
import { listCommunesByWilayaAction } from "../../../actions/communeActions";
import { listDairasByWilayaAction } from "../../../actions/dairaActions";
import { addSystem } from "../../../actions/systemActions";
import { useNavigate } from "react-router-dom";

function System() {
  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [selectedCommune, setSelectedCommune] = useState("");
  const [selectedDaira, setSelectedDaira] = useState("");
  const [wilayasList, setWilayasList] = useState([]);
  const [communesList, setCommunesList] = useState([]);
  const [dairasList, setDairasList] = useState([]);
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

  const dairaGetByWilaya = useSelector((state) => state.dairaGetByWilaya);
  const {
    loading: loadingDairas,
    dairas,
    error: errorDairas,
  } = dairaGetByWilaya;

  const systemAdd = useSelector((state) => state.systemAdd);
  const { loading: loadingSystem, systemInfo, error: errorSystem } = systemAdd;

  useEffect(() => {
    dispatch(listWilayasAction());
  }, [dispatch]);

  let history = useNavigate();

  useEffect(() => {
    if (systemInfo) {
      history("/login");
    }
  }, [systemInfo, history]);

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
    if (dairas?.length > 0) {
      setDairasList(dairas);
    }
  }, [dairas]);

  useEffect(() => {
    dispatch(listCommunesByWilayaAction(selectedWilaya));
    dispatch(listDairasByWilayaAction(selectedWilaya));
  }, [dispatch, selectedWilaya]);

  const addSystemButton = async (event) => {
    event.preventDefault();
    if (typeAdmin === "daira") {
      if (selectedDaira !== "") {
        dispatch(addSystem(typeAdmin, selectedDaira));
      }
    }
    if (typeAdmin === "commune") {
      if (selectedCommune !== "") {
        dispatch(addSystem(typeAdmin, selectedCommune));
      }
    }
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

  const readCommune = (communs) => {
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
        {communs?.map((commune) => (
          <option key={commune._id} value={commune.code}>
            {commune.nomAr}
          </option>
        ))}
      </select>
    );
  };

  const readDaira = (dairs) => {
    return (
      <select
        onChange={(e) => setSelectedDaira(e.target.value)}
        id="comm_n"
        className="form-control text-right"
        name="comm_n"
        defaultValue="-1"
        required
      >
        <option value="-1" disabled hidden>
          اختر البلدية
        </option>
        {dairs?.map((commune) => (
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
      {errorDairas && (
        <ErrorMessage variant="danger">{errorDairas}</ErrorMessage>
      )}
      {loadingDairas && <Loading />}
      {errorSystem && (
        <ErrorMessage variant="danger">{errorSystem}</ErrorMessage>
      )}
      {loadingSystem && <Loading />}

      {errorSystem && (
        <ErrorMessage variant="danger">{errorSystem}</ErrorMessage>
      )}
      {loadingSystem && <Loading />}
      <div>
        <Card.Header className="form-control text-right">الادارة</Card.Header>
        <Card.Body>
          <select
            onChange={(e) => setTypeAdmin(e.target.value)}
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
            <Card.Body>{readDaira(dairasList)}</Card.Body>
            <Button onClick={(e) => addSystemButton(e)}>تثبيت</Button>
          </div>
        )}
      </div>
    </MainScreen>
  );
}

export default System;
