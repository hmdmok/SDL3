import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../../../components/ErrorMessage";
import Loading from "../../../components/Loading";
import MainScreen from "../../../components/MainScreen/MainScreen";
import { useDispatch, useSelector } from "react-redux";

import "./Login.css";
import { login } from "../../../actions/userActions";
import { listCommunesByDairaAction } from "../../../actions/communeActions";
import { checkSystem, updateSystem } from "../../../actions/systemActions";

function Login() {
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");
  const [commune, setCommune] = useState({});
  const [daira, setDaira] = useState("");
  const [systemInfo, setSystemInfo] = useState([]);

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const communeGetByWilaya = useSelector((state) => state.communeGetByDaira);
  const {
    loading: loadingCommunes,
    communes,
    error: errorCommunes,
  } = communeGetByWilaya;

  let history = useNavigate();
  useEffect(() => {
    if (error === "Initiate system file!!!") {
      history("/system");
    } else {
      // const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        history("/home");
      }
    }
  }, [history, userInfo, error]);

  useEffect(() => {
    dispatch(checkSystem());
    setSystemInfo(JSON.parse(localStorage.getItem("systemInfo")));
  }, [dispatch]);

  useEffect(() => {
    if (systemInfo?.length > 0 && systemInfo[0]?.administrationName) {
      setDaira(systemInfo[0].administrationName);
    }
  }, [systemInfo]);

  useEffect(() => {
    if (daira !== "") dispatch(listCommunesByDairaAction(daira));
  }, [dispatch, daira]);

  const submitHandler = async (event) => {
    event.preventDefault();
    dispatch(
      updateSystem(
        systemInfo[0]._id,
        null,
        null,
        null,
        null,
        null,
        commune.nomFr,
        commune.code,
        null,
        null,
        null,
        null,
        null,
        null
      )
    );

    dispatch(login(userName, passWord));
  };

  return (
    <>
      {errorCommunes && (
        <ErrorMessage variant="danger">{errorCommunes}</ErrorMessage>
      )}
      {loadingCommunes && <Loading />}
      {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
      {loading && <Loading />}
      <MainScreen title={"الرجاء تسجيل الدخول"}>
        <div className="loginContainer">
          <Form onSubmit={submitHandler}>
            <Form.Group>
              <Form.Label htmlFor="com_n">البلدية </Form.Label>
              <Form.Select
                onChange={(e) => {
                  const result = communes?.find(
                    ({ _id }) => _id === e.target.value
                  );
                  setCommune(result);
                }}
                id="com_n"
                className="form-control text-right"
                name="com_n"
                defaultValue="-1"
                required
              >
                <option value="-1" disabled hidden>
                  اختر البلدية
                </option>
                {communes?.map((commune) => (
                  <option key={commune._id} value={commune._id}>
                    {commune.nomAr}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="inputUsername">اسم المستخدم</Form.Label>
              <Form.Control
                name="loginUsername"
                type="username"
                id="inputUsername"
                placeholder="اسم المستخدم"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label htmlFor="inputPassword">كلمة السر</Form.Label>
              <Form.Control
                name="loginPassword"
                type="password"
                id="inputPassword"
                placeholder="كلمة السر"
                value={passWord}
                onChange={(e) => setPassWord(e.target.value)}
              />
            </Form.Group>
            <hr />
            <Button variant="primary" type="submit">
              تسجيل الدخول
            </Button>
          </Form>
        </div>
      </MainScreen>
    </>
  );
}

export default Login;
