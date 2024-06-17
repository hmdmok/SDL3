import React, { useEffect, useState } from "react";
import { Card, Form } from "react-bootstrap";
import ErrorMessage from "../../../components/ErrorMessage";
import Loading from "../../../components/Loading";
import MainScreen from "../../../components/MainScreen/MainScreen";
import { useDispatch, useSelector } from "react-redux";
import { add } from "../../../actions/quotaActions";

function AddQuota() {
  const [quotaname, setQuotaname] = useState("");
  const [quotanameFr, setQuotanameFr] = useState("");
  const [quotadate, setQuotaDate] = useState("");
  const [quotaquant, setQuotaquant] = useState("");
  const [quotascan, setQuotascan] = useState(null);
  const [remark, setRemark] = useState("");
  const [creator, setCreator] = useState("");
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

    dispatch(
      add(
        quotaname,
        quotanameFr,
        quotadate,
        quotaquant,
        quotascan,
        creator,
        remark
      )
    );
  };

  return (
    <MainScreen title="اضافة حصة جديد">
      {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
      {loading && <Loading />}
      <Form onSubmit={onSubmitQuota}>
        <Form.Group className="row text-right">
          <Form.Group className="col">
            <Form.Label htmlFor="Form.ControlQuotadate" className="">
              {"تاريخ الحصة"}
            </Form.Label>
            <Form.Control
              value={quotadate}
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
            <Form.Label htmlFor="Form.ControlQuotaquant" className="">
              {"عدد السكنات في الحصة"}
            </Form.Label>
            <Form.Control
              value={quotaquant}
              name="quotaquant"
              onChange={(e) => setQuotaquant(e.target.value)}
              type="number"
              id="Form.ControlQuotaquant"
              className="form-control text-right"
              placeholder="عدد السكنات في الحصة"
              required
            />
          </Form.Group>
        </Form.Group>
        <Form.Group className="row text-right">
          <Form.Group className="col">
            <Form.Label htmlFor="Form.ControlQuotaname" className="">
              {"اسم الحصة"}
            </Form.Label>
            <Form.Control
              value={quotaname}
              name="quotaname"
              onChange={(e) => setQuotaname(e.target.value)}
              type="text"
              id="Form.ControlQuotaname"
              className="form-control text-right"
              placeholder="اسم الحصة"
              required
            />
          </Form.Group>
        </Form.Group>
        <Form.Group className="row text-right">
          <Form.Group className="col">
            <Form.Label htmlFor="Form.ControlQuotaname" className="">
              {"اسم الحصة بالفرنسية"}
            </Form.Label>
            <Form.Control
              value={quotanameFr}
              name="quotanameFr"
              onChange={(e) => setQuotanameFr(e.target.value)}
              type="text"
              id="Form.ControlQuotaname"
              className="form-control text-right"
              placeholder="اسم الحصة بالفرنسية"
              required
            />
          </Form.Group>
        </Form.Group>

        <Form.Group className="row">
          <Form.Group className="col">
            <Card.Body>
              <Card.Text>{"صورة مقرر الحصة"}</Card.Text>
            </Card.Body>
            {preview ? (
              <Card.Img src={preview} width="300px" alt="pic" />
            ) : (
              <Card.Img
                src={`http://localhost:4000/${quotascan}`}
                width="300px"
                alt="pic"
              />
            )}
          </Form.Group>
          <Form.Group className="d-flex align-items-center col-9">
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label> {"صورة مقرر الحصة"}</Form.Label>
              <Form.Control
                type="file"
                name="photo_link"
                placeholder="ادخل صورة مقرر الحصة"
                onChange={(e) => setQuotascan(e.target.files[0])}
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
              value="  تسجيل الحصة"
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
