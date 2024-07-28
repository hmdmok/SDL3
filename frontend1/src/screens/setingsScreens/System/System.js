import React, { useEffect, useState, useMemo } from "react";
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
  const [selectedDaira, setSelectedDaira] = useState("");
  const typeAdmin = "daira";
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    loading: loadingWilayas,
    wilayas,
    error: errorWilayas,
  } = useSelector((state) => state.wilayaList);
  const {
    loading: loadingDairas,
    dairas,
    error: errorDairas,
  } = useSelector((state) => state.dairaGetByWilaya);
  const {
    loading: loadingSystem,
    systemInfo,
    error: errorSystem,
  } = useSelector((state) => state.systemAdd);

  useEffect(() => {
    dispatch(listWilayasAction());
  }, [dispatch]);

  useEffect(() => {
    if (systemInfo) {
      navigate("/login");
    }
  }, [systemInfo, navigate]);

  useEffect(() => {
    if (selectedWilaya) {
      dispatch(listCommunesByWilayaAction(selectedWilaya));
      dispatch(listDairasByWilayaAction(selectedWilaya));
    }
  }, [dispatch, selectedWilaya]);

  const handleAddSystem = async (event) => {
    event.preventDefault();
    if (typeAdmin === "daira" && selectedDaira) {
      dispatch(addSystem(typeAdmin, selectedDaira));
    }
  };

  const wilayaOptions = useMemo(
    () =>
      wilayas?.map((wilaya) => (
        <option key={wilaya._id} value={wilaya.code}>
          {wilaya.nomAr}
        </option>
      )),
    [wilayas]
  );

  const dairaOptions = useMemo(
    () =>
      dairas?.map((daira) => (
        <option key={daira.code} value={daira.nomFr}>
          {daira.nomAr}
        </option>
      )),
    [dairas]
  );

  return (
    <MainScreen title="اعدادات تثبيت التطبيقة">
      {errorWilayas && (
        <ErrorMessage variant="danger">{errorWilayas}</ErrorMessage>
      )}
      {loadingWilayas && <Loading />}

      {errorDairas && (
        <ErrorMessage variant="danger">{errorDairas}</ErrorMessage>
      )}
      {loadingDairas && <Loading />}

      {errorSystem && (
        <ErrorMessage variant="danger">{errorSystem}</ErrorMessage>
      )}
      {loadingSystem && <Loading />}

      <div>
        <div>
          <Card.Header className="form-control text-right">
            اختار الولاية
          </Card.Header>
          <Card.Body>
            <select
              onChange={(e) => setSelectedWilaya(e.target.value)}
              id="wil_n"
              className="form-control text-right"
              name="wil_n"
              defaultValue="-1"
              required
            >
              <option value="-1" key={"wilaya"} disabled hidden>
                اختر الولاية
              </option>
              {wilayaOptions}
            </select>
          </Card.Body>
        </div>

        <div>
          <Card.Header className="form-control text-right">
            اختار الدائرة
          </Card.Header>
          <Card.Body>
            <select
              onChange={(e) => setSelectedDaira(e.target.value)}
              id="comm_n"
              className="form-control text-right"
              name="comm_n"
              defaultValue="-1"
              required
            >
              <option value="-1" key={"daira"} disabled hidden>
                اختر البلدية
              </option>
              {dairaOptions}
            </select>
            <Button onClick={handleAddSystem}>تثبيت</Button>
          </Card.Body>
        </div>
      </div>
    </MainScreen>
  );
}

export default System;
