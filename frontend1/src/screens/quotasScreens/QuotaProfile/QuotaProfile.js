import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { update } from "../../../actions/quotaActions";
import ErrorMessage from "../../../components/ErrorMessage";
import Loading from "../../../components/Loading";
import MainScreen from "../../../components/MainScreen/MainScreen";
import { useSelector, useDispatch } from "react-redux";

function QuotaProfile() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [birthday, setBirthday] = useState("");
  const [phone, setPhone] = useState("");
  const [quotatype, setQuotatype] = useState("");
  const [quotaname, setQuotaname] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [email, setEmail] = useState("");
  const [photo_link, setPhoto_link] = useState("quotasPicUpload/default.png");
  const photo_file = null;
  const [remark, setRemark] = useState("");
  const [message, setMessage] = useState(null);
  const [creator, setCreator] = useState("");
  const [changePassword, setChangePassword] = useState(false);

  const dispatch = useDispatch();

  const quotaUpdate = useSelector((state) => state.quotaUpdate);
  const { loading, error } = quotaUpdate;

  let navigate = useNavigate();
  let { id } = useParams();

  useEffect(() => {
    const fetching = async () => {
      const { data } = await axios.get(`/api/quotas/${id}`);

      setCreator(data.creator);
      setFirstname(data.firstname);
      setLastname(data.lastname);
      setBirthday(data.birthday);
      setPhone(data.phone);
      setQuotatype(data.quotatype);
      setQuotaname(data.quotaname);
      setEmail(data.email);
      setPhoto_link(data.photo_link);
      setRemark(data.remark);
    };
    fetching();
  }, [id]);

  const submitPasswordHandler = async (event) => {
    event.preventDefault();
    if (password !== repassword) {
      setMessage("خطء في تاكيد كلمة السر");
    } else {
      dispatch(
        update(
          id,
          firstname,
          quotaname,
          lastname,
          quotatype,
          password,
          birthday,
          creator,
          remark,
          email,
          phone,
          photo_link,
          photo_file
        )
      );
      if (!error && !message) {
        navigate("/home");
      }
    }
  };

  return (
    <MainScreen>
      {message && <ErrorMessage variant="danger">{message}</ErrorMessage>}
      {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
      {loading && <Loading />}

      <Form onSubmit={submitPasswordHandler}>
        <Form.Group className="row text-right">
          <Form.Group className="col order-last">
            <Form.Label htmlFor="Form.ControlFirstName" className="text-right">
              الاسم
            </Form.Label>
            <Form.Control
              disabled
              defaultValue={firstname}
              name="firstname"
              type="text"
              id="Form.ControlFirstName"
              className="form-control text-right"
              placeholder="الاسم "
              autoFocus
            />
          </Form.Group>
          <Form.Group className="col order-first">
            <Form.Label htmlFor="Form.ControlLastName" className="text-right">
              اللقب
            </Form.Label>
            <Form.Control
              disabled
              defaultValue={lastname}
              name="lastname"
              type="name"
              id="Form.ControlLastName"
              className="form-control text-right"
              placeholder="اللقب"
            />
          </Form.Group>
        </Form.Group>
        <Form.Group className="row text-right">
          <Form.Group className="col">
            <Form.Label htmlFor="Form.ControlBirthday" className="">
              تاريخ الميلاد
            </Form.Label>
            <Form.Control
              disabled
              defaultValue={birthday}
              name="birthday"
              type="date"
              id="Form.ControlBirthday"
              className="form-control text-right"
              placeholder="تاريخ الميلاد"
            />
          </Form.Group>
          <Form.Group className="col order-first">
            <Form.Label htmlFor="Form.ControlTelephone" className="">
              رقم الهاتف
            </Form.Label>
            <Form.Control
              disabled
              defaultValue={phone}
              name="phone"
              type="tel"
              id="Form.ControlTelephone"
              className="form-control text-right"
              placeholder="رقم الهاتف"
            />
          </Form.Group>
        </Form.Group>
        <Form.Group className="row text-right">
          <Form.Group className="col">
            <Form.Label htmlFor="Form.ControlQuotatype" className="">
              وظيفة المستخدم
            </Form.Label>
            <Form.Control
              disabled
              defaultValue={quotatype}
              name="quotatype"
              id="Form.ControlQuotatype"
              className="form-control text-right"
              placeholder="وظيفة المستخدم"
            />
          </Form.Group>
          <Form.Group className="col">
            <Form.Label htmlFor="Form.ControlQuotaname" className="">
              اسم المستخدم
            </Form.Label>
            <Form.Control
              disabled
              defaultValue={quotaname}
              name="quotaname"
              type="text"
              id="Form.ControlQuotaname"
              className="form-control text-right"
              placeholder="اسم المستخدم"
            />
          </Form.Group>
        </Form.Group>
        {changePassword ? (
          <Form.Group className="row text-right">
            <Form.Group className="col order-last">
              <Form.Label htmlFor="Form.ControlPassword" className="">
                كلمة السر
              </Form.Label>
              <Form.Control
                name="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                  setMessage(false);
                }}
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
                name="repassword"
                onChange={(e) => {
                  setRepassword(e.target.value);
                  setMessage(false);
                }}
                type="password"
                id="Form.ControlRepassword"
                className="form-control text-right"
                placeholder="تاكيد كلمة السر"
                required
              />
            </Form.Group>
          </Form.Group>
        ) : (
          <>
            <Form.Group className="row align-items-center text-right">
              <Form.Group className="col text-right">
                <Form.Group className="row  text-right">
                  <Form.Label htmlFor="Form.ControlEmail" className="">
                    ادخل البريد الالكتروني
                  </Form.Label>
                  <Form.Control
                    disabled
                    defaultValue={email}
                    name="email"
                    type="email"
                    id="Form.ControlEmail"
                    className="form-control text-right"
                    placeholder="البريد الالكتروني"
                  />
                </Form.Group>
                <Form.Group className="row">
                  <Form.Label htmlFor="inpuRemark" className="">
                    ملاحظات
                  </Form.Label>
                  <Form.Control
                    disabled
                    defaultValue={remark}
                    name="remark"
                    type="text"
                    id="Form.ControlRemark"
                    className="form-control text-right"
                    placeholder="ملاحظات "
                  />
                </Form.Group>
              </Form.Group>

              <Form.Group className="col-3">
                <Form.Group className="row">
                  <Card.Body>
                    <Card.Text>صورة المستخدم</Card.Text>
                  </Card.Body>

                  <Card.Img
                    src={`http://localhost:4000/${photo_link}`}
                    width="50"
                    alt="pic"
                  />
                </Form.Group>
              </Form.Group>
            </Form.Group>
          </>
        )}

        <hr />
        <Form.Group className="row">
          {changePassword ? (
            <Form.Group className="col order-last">
              <Button className="w-25" type="submit" variant="success">
                ثبيت
              </Button>
            </Form.Group>
          ) : (
            <Form.Group className="col order-last button">
              <Button
                className="w-25"
                onClick={() => setChangePassword(true)}
                variant="danger"
              >
                تعديل كلمة السر
              </Button>
            </Form.Group>
          )}
          <Form.Group className="col order-first button">
            <Button
              className="w-25"
              onClick={() => navigate("/home")}
              variant="primary"
            >
              رجوع
            </Button>
          </Form.Group>
        </Form.Group>
      </Form>
    </MainScreen>
  );
}

export default QuotaProfile;
