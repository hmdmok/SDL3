import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import ErrorMessage from "../../components/ErrorMessage";
import Loading from "../../components/Loading";
import MainScreen from "../../components/MainScreen/MainScreen";


import "./Login.css";

function Login() {
  
  const [userName, setUserName] = useState("");
  const [passWord, setPassWord] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);


  const submitHandler = async (event) => {
    event.preventDefault();
    setError(false);
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };

      setLoading(true);
      const { data } = await axios.post(
        "/api/users/login",
        {
          username: userName,
          password: passWord,
        },
        config
      );
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      setError(error.response.data.message);
    }
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
              required
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
