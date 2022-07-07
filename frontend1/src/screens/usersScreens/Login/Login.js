import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import ErrorMessage from "../../../components/ErrorMessage";
import Loading from "../../../components/Loading";
import MainScreen from "../../../components/MainScreen/MainScreen";
import { useDispatch, useSelector } from "react-redux";

import "./Login.css";
import { login } from "../../../actions/userActions";

function Login() {
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  let history = useNavigate();
  useEffect(() => {
    // const userInfo = localStorage.getItem("userInfo");
    if (userInfo) {
      history("/home");
    }
  }, [history, userInfo]);

  const submitHandler = async (event) => {
    event.preventDefault();
    dispatch(login(userName, passWord));
  };

  return (
    <MainScreen title={"الرجاء تسجيل الدخول"}>
      <div className="loginContainer">
        {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
        {loading && <Loading />}
        <Form onSubmit={submitHandler}>
          <Form.Group>
            <Form.Label htmlFor="inputUsername">اسم المستخدم</Form.Label>
            <Form.Control
              name="loginUsername"
              type="username"
              id="inputUsername"
              placeholder="اسم المستخدم"
              required
              autoFocus
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
  );
}

export default Login;
