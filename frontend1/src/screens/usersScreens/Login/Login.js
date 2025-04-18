import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { DevTool } from "@hookform/devtools";
import Loading from "../../../components/Loading";
import MainScreen from "../../../components/MainScreen/MainScreen";
import { useDispatch, useSelector } from "react-redux";
import "./Login.css";
import { login } from "../../../actions/userActions";
import { listCommunesByDairaAction } from "../../../actions/communeActions";
import { checkSystem } from "../../../actions/systemActions";

function Login() {
  const [daira, setDaira] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error, userInfo } = useSelector((state) => state.userLogin);
  const { systemInfo } = useSelector((state) => state.systemCheck);

  const form = useForm({ defaultValues: { communeId: -1 } });
  const { register, handleSubmit, control, formState, setError } = form;
  const { errors, isSubmitting } = formState;

  useEffect(() => {
    if (error === "Initiate system file!!!") {
      navigate("/system");
    } else if (userInfo) {
      navigate("/home");
    }
  }, [navigate, userInfo, error]);

  useEffect(() => {
    dispatch(checkSystem());
  }, [dispatch]);

  useEffect(() => {
    if (systemInfo?.length > 0 && systemInfo[0]?.administrationName) {
      setDaira(systemInfo[0].administrationName);
    }
  }, [systemInfo]);

  useEffect(() => {
    if (daira !== "") {
      dispatch(listCommunesByDairaAction(daira));
    }
  }, [dispatch, daira]);

  const onSubmit = async (data) => {
    try {
      dispatch(login(data.userName, data.passWord));
    } catch (error) {
      setError("communeId", {
        type: "manual",
        message: error.message,
      });
    }
  };
  return (
    <MainScreen title={"الرجاء تسجيل الدخول"}>
      <div className="loginContainer">
        <Form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Form.Group className="text-right">
            <Form.Label htmlFor="inputUsername">اسم المستخدم</Form.Label>
            <Form.Control
              type="text"
              id="inputUsername"
              {...register("userName", {
                required: "الرجاء ادخال اسم المستخدم",
              })}
              className="text-right"
            />
            {errors.userName && (
              <p className="text-danger text-right">
                {errors.userName.message}
              </p>
            )}
          </Form.Group>
          <Form.Group className="text-right">
            <Form.Label htmlFor="inputPassword">كلمة السر</Form.Label>
            <Form.Control
              type="password"
              id="inputPassword"
              {...register("passWord", { required: "الرجاء ادخال كلمة السر" })}
              className="text-right"
            />
            {errors.passWord && (
              <p className="text-danger text-right">
                {errors.passWord.message}
              </p>
            )}
          </Form.Group>
          <Form.Group className="d-flex justify-content-center">
            <Button
              disabled={isSubmitting}
              className="m-3"
              variant="primary"
              type="submit"
            >
              {isSubmitting || loading ? "جاري" : "تسجيل الدخول"}
            </Button>
          </Form.Group>
         
          {error && <p className="text-danger text-right">{error}</p>}
          {loading && <Loading />}
        </Form>
        <DevTool control={control} />
      </div>
    </MainScreen>
  );
}

export default Login;
