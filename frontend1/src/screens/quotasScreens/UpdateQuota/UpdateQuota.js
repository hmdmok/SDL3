import React, { useEffect, useState } from "react";
import { Card, Form } from "react-bootstrap";
import ErrorMessage from "../../../components/ErrorMessage";
import Loading from "../../../components/Loading";
import MainScreen from "../../../components/MainScreen/MainScreen";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deleteQuotaAction, update } from "../../../actions/quotaActions";
import axios from "axios";

function UpdateQuota() {
  const [quotadate, setQuotaDate] = useState("");
  const [quotaquant, setQuotaquant] = useState("");
  const [quotaname, setQuotaname] = useState("");
  const [quotanameFr, setQuotanameFr] = useState("");
  const [quotascan, setQuotascan] = useState("quotasPicUpload/default.png");
  const [photo_file, setPhoto_file] = useState(null);
  const [remark, setRemark] = useState("");
  const [preview, setPreview] = useState(null);
  const [creator, setCreator] = useState("");

  const dispatch = useDispatch();

  const quotaUpdate = useSelector((state) => state.quotaUpdate);
  const { loading, error, success } = quotaUpdate;

  const quotaDelete = useSelector((state) => state.quotaDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = quotaDelete;

  const creatorData = localStorage.getItem("userInfo");
  const creatorInfo = JSON.parse(creatorData);
  const creatorQuotaname = creatorInfo.username;

  let navigate = useNavigate();
  let { id } = useParams();

  useEffect(() => {
    const fetching = async () => {
      const { data } = await axios.get(`/api/quotas/${id}`);
      setQuotaDate(data.quotadate);
      setQuotaquant(data.quotaquant);
      setQuotaname(data.quotaname);
      setQuotanameFr(data.quotanameFr);
      setQuotascan(data.quotascan);
      setRemark(data.remark);
    };
    fetching();
  }, [id]);

  useEffect(() => {
    setCreator(creatorQuotaname);
  }, [creatorQuotaname]);

  useEffect(() => {
    if (success) {
      navigate("/quotas");
    }
    if (successDelete) {
      navigate("/quotas");
    }
  }, [navigate, success, successDelete]);

  useEffect(() => {
    if (photo_file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(photo_file);
    } else {
      setPreview(null);
    }
  }, [photo_file]);

  const onSubmitUtilisateur = async (event) => {
    event.preventDefault();

    dispatch(
      update(
        id,
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

  const deleteHandler = (idToDel) => {
    if (window.confirm("هل انت متاكد من هذه العملية")) {
      dispatch(deleteQuotaAction(idToDel));
    }
  };

  return (
    <MainScreen title="تعديل حصة">

      {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
      {loading && <Loading />}

      {errorDelete && <ErrorMessage variant="danger">{error}</ErrorMessage>}
      {loadingDelete && <Loading />}

      <Form onSubmit={onSubmitUtilisateur}>
        
        <Form.Group className="row text-right">
          <Form.Group className="col">
            <Form.Label htmlFor="Form.ControlQsetQuotaDate" className="">
              تاريخ الحصة
            </Form.Label>
            <Form.Control
              value={quotadate}
              name="quotadate"
              onChange={(e) => setQuotaDate(e.target.value)}
              type="date"
              id="Form.ControlQsetQuotaDate"
              className="form-control text-right"
              placeholder="تاريخ الحصة"
            />
          </Form.Group>
          <Form.Group className="col order-first">
            <Form.Label htmlFor="Form.ControlTelequotaquant" className="">
             عدد سكنات الحصة
            </Form.Label>
            <Form.Control
              value={quotaquant}
              name="quotaquant"
              onChange={(e) => setQuotaquant(e.target.value)}
              type="number"
              id="Form.ControlTelequotaquant"
              className="form-control text-right"
              placeholder="عدد سكنات الحصة"
            />
          </Form.Group>
        </Form.Group>
        <Form.Group className="row text-right">
       
          <Form.Group className="col">
            <Form.Label htmlFor="Form.ControlQuotaname" className="">
              اسم الحصة
            </Form.Label>
            <Form.Control
              value={quotaname}
              name="quotaname"
              onChange={(e) => setQuotaname(e.target.value)}
              type="text"
              id="Form.ControlQuotaname"
              className="form-control text-right"
              placeholder="اسم الحصة"
            />
          </Form.Group>
          <Form.Group className="col">
            <Form.Label htmlFor="Form.ControlQuotanameFr" className="">
              اسم الحصة بالفرنسية
            </Form.Label>
            <Form.Control
              value={quotanameFr}
              name="quotanameFr"
              onChange={(e) => setQuotanameFr(e.target.value)}
              type="text"
              id="Form.ControlQuotanameFr"
              className="form-control text-right"
              placeholder="اسم الحصة بالفرنسية"
            />
          </Form.Group>
        </Form.Group>

        <Form.Group className="row">
          <Form.Group className="col">
            <Card.Body>
              <Card.Text>صورة مقرر الحصة</Card.Text>
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
              <Form.Label> صورة مقرر الحصة</Form.Label>
              <Form.Control
                type="file"
                name="quotascan"
                placeholder="ادخل صورة مقرر الحصة"
                onChange={(e) => {
                  setPhoto_file(e.target.files[0]);
                  setQuotascan("quotasPicUpload/default.png");
                }}
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
              className="btn btn-lg btn-success btn-block"
              type="submit"
              value="تعديل الحصة"
            />
          </Form.Group>
          <Form.Group className="col">
            <Form.Control
              onClick={() => deleteHandler(id)}
              className="btn btn-lg btn-danger btn-block"
              type="submit"
              value="حذف الحصة"
            />
          </Form.Group>
          <Form.Group className="col order-first">
            <Form.Control
              onClick={() => navigate("/quotas")}
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

export default UpdateQuota;
