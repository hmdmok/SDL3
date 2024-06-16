import React, { useEffect, useState } from "react";
import { Card, Form } from "react-bootstrap";
import ErrorMessage from "../../../components/ErrorMessage";
import Loading from "../../../components/Loading";
import MainScreen from "../../../components/MainScreen/MainScreen";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { add } from "../../../actions/quotaActions";

function AddQuota() {
  const [quotaname, setQuotaname] = useState("");
  const [quotaDate, setQuotaDate] = useState("");
  const [quotaquant, setQuotaquant] = useState("");
  const [quotascan, setQuotascan] = useState(null);
  const [remark, setRemark] = useState("");
  const [creator, setCreator] = useState("");
  const [message, setMessage] = useState(null);
  const [preview, setPreview] = useState(null);

  const creatorData = localStorage.getItem("userInfo");
  const creatorInfo = JSON.parse(creatorData);
  const creatorUsername = creatorInfo.username;

  useEffect(() => {
    setCreator(creatorUsername);
  }, [creatorUsername]);

  const dispatch = useDispatch();
  const quotaAdd = useSelector((state) => state.quotaAdd);

  const { loading, error } = quotaAdd;

  useEffect(() => {
    if (quotascan) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(quotascan);
    } else {
      setPreview(null);
    }
  }, [quotascan]);

  const onSubmitQuota = async (event) => {
    event.preventDefault();

    dispatch(add(quotaname, quotaDate, quotaquant, creator, remark, quotascan));
  };

  return (
    <MainScreen title="اضافة مستخدم جديد">
      {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
      {message && <ErrorMessage variant="info">{message}</ErrorMessage>}
      {loading && <Loading />}
      <Form onSubmit={onSubmitQuota}>
      
        <Form.Group className="row text-right">
          <Form.Group className="col">
            <Form.Label htmlFor="Form.ControlQuotadate" className="">
              تاريخ الميلاد
            </Form.Label>
            <Form.Control
              value={quotaDate}
              name="quotaDate"
              onChange={(e) => {
                setQuotaDate(e.target.value);
              }}
              type="date"
              id="Form.ControlQuotadate"
              className="form-control text-right"
              placeholder="تاريخ الحصة"
              required
            />
          </Form.Group>
          <Form.Group className="col order-first">
            <Form.Label htmlFor="Form.ControlTelephone" className="">
              رقم الهاتف
            </Form.Label>
            <Form.Control
              value={phone}
              name="phone"
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              id="Form.ControlTelephone"
              className="form-control text-right"
              placeholder="رقم الهاتف"
              required
            />
          </Form.Group>
        </Form.Group>
        <Form.Group className="row text-right">
          <Form.Group className="col">
            <Form.Label htmlFor="Form.ControlQuotaquant" className="">
              وظيفة المستخدم
            </Form.Label>
            <select
              value={quotaquant}
              name="quotaquant"
              onChange={(e) => setQuotaquant(e.target.value)}
              id="Form.ControlQuotaquant"
              className="form-control text-right"
              placeholder="عدد السكنات في الحصة"
              required
            >
              <option value="-1" disabled hidden>
                وظيفة المستخدم
              </option>
              <option value="super">مطور</option>
              <option value="admin">مسير</option>
              <option value="agent">عون حجز</option>
            </select>
          </Form.Group>
          <Form.Group className="col">
            <Form.Label htmlFor="Form.ControlQuotaname" className="">
              اسم المستخدم
            </Form.Label>
            <Form.Control
              value={quotaname}
              name="quotaname"
              onChange={(e) => setQuotaname(e.target.value)}
              type="text"
              id="Form.ControlQuotaname"
              className="form-control text-right"
              placeholder="اسم المستخدم"
              required
            />
          </Form.Group>
        </Form.Group>
        <Form.Group className="row text-right">
          <Form.Group className="col order-last">
            <Form.Label htmlFor="Form.ControlPassword" className="">
              كلمة السر
            </Form.Label>
            <Form.Control
              value={password}
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="Form.ControlPassword"
              className="form-control text-right"
              placeholder="كلمة السر"
              required
            />
          </Form.Group>
          <Form.Group className="col">
            <Form.Label htmlFor="Form.ControlRepassword" className="">
              تاكيد كلمة السر
            </Form.Label>
            <Form.Control
              value={repassword}
              name="repassword"
              onChange={(e) => setRepassword(e.target.value)}
              type="password"
              id="Form.ControlRepassword"
              className="form-control text-right"
              placeholder="تاكيد كلمة السر"
              required
            />
          </Form.Group>
        </Form.Group>
        <Form.Group className="row text-right">
          <Form.Group className="col">
            <Form.Label htmlFor="Form.ControlEmail" className="">
              ادخل البريد الالكتروني
            </Form.Label>
            <Form.Control
              value={email}
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="Form.ControlEmail"
              className="form-control text-right"
              placeholder="البريد الالكتروني"
              required
            />
          </Form.Group>
        </Form.Group>

        <Form.Group className="row">
          <Form.Group className="col">
            <Card.Body>
              <Card.Text>صورة المستخدم</Card.Text>
            </Card.Body>
            {preview ? (
              <Card.Img src={preview} width="300px" alt="pic" />
            ) : (
              <Card.Img
                src={`http://localhost:4000/${photo_link}`}
                width="300px"
                alt="pic"
              />
            )}
          </Form.Group>
          <Form.Group className="d-flex align-items-center col-9">
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label> صورة المستخدم</Form.Label>
              <Form.Control
                type="file"
                name="photo_link"
                placeholder="ادخل صورة المستخدم"
                onChange={(e) => setPhoto_file(e.target.files[0])}
              />
            </Form.Group>
          </Form.Group>
        </Form.Group>
        <Form.Group className="row">
          <Form.Group className="col">
            <Form.Label htmlFor="inpuRemark" className="">
              ملاحظات
            </Form.Label>
            <Form.Control
              value={remark}
              name="remark"
              onChange={(e) => setRemark(e.target.value)}
              type="text"
              id="Form.ControlRemark"
              className="form-control text-right"
              placeholder="ملاحظات "
            />
          </Form.Group>
        </Form.Group>
        <hr />
        <Form.Group className="row">
          <Form.Group className="col order-last">
            <Form.Control
              className="btn btn-lg btn-primary btn-block"
              type="submit"
              value="  تسجيل الدخول"
            />
          </Form.Group>
          <Form.Group className="col">
            <Form.Control
              className="btn btn-lg btn-primary btn-block"
              type="reset"
              value="تراجع"
            />
          </Form.Group>
        </Form.Group>
      </Form>
    </MainScreen>
  );
}

export default AddQuota;
