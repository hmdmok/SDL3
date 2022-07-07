import React, { useEffect, useState } from "react";
import { Button, Card, Container, Form, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ErrorMessage from "../../../components/ErrorMessage";
import Loading from "../../../components/Loading";
import MainScreen from "../../../components/MainScreen/MainScreen";
import {
  addCommuneAction,
  deleteCommuneAction,
  listCommunesAction,
  updateCommuneAction,
} from "../../../actions/communeActions";
import { listWilayasAction } from "../../../actions/wilayaActions";

function Commune() {
  const [editCommuneId, setEditCommuneId] = useState(null);
  const [editCommuneCode, setEditCommuneCode] = useState(null);
  const [editCommuneNomAr, setEditCommuneNomAr] = useState(null);
  const [editCommuneNomFr, setEditCommuneNomFr] = useState(null);
  const [editCommuneCodeWilaya, setEditCommuneCodeWilaya] = useState(null);

  const [addCommuneId, setAddCommuneId] = useState(false);
  const [addCommuneCode, setAddCommuneCode] = useState("");
  const [addCommuneNomAr, setAddCommuneNomAr] = useState("");
  const [addCommuneNomFr, setAddCommuneNomFr] = useState("");
  const [addCommuneCodeWilaya, setAddCommuneCodeWilaya] = useState("");

  const dispatch = useDispatch();

  const communeList = useSelector((state) => state.communeList);
  const { loading, communes, error } = communeList;

  const communeDelete = useSelector((state) => state.communeDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = communeDelete;

  const communeUpdate = useSelector((state) => state.communeUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = communeUpdate;

  const communeAdd = useSelector((state) => state.communeAdd);
  const {
    loading: loadingAdd,
    error: errorAdd,
    success: successAdd,
  } = communeAdd;

  const wilayaList = useSelector((state) => state.wilayaList);
  const { loading: loadingWilayas, wilayas, error: errorWilayas } = wilayaList;

  useEffect(() => {
    dispatch(listWilayasAction());
  }, [dispatch]);

  useEffect(() => {
    dispatch(listCommunesAction());
    if (successUpdate) {
      setEditCommuneId(null);
      setEditCommuneCode(null);
      setEditCommuneNomAr(null);
      setEditCommuneNomFr(null);
      setEditCommuneCodeWilaya(null);
    }
    if (successAdd) {
      setAddCommuneId(false);
      setAddCommuneCode("");
      setAddCommuneNomAr("");
      setAddCommuneNomAr("");
      setAddCommuneCodeWilaya("");
    }
  }, [dispatch, successDelete, successUpdate, successAdd]);

  const deleteHandler = (e, id) => {
    e.preventDefault();
    if (window.confirm("هل انت متاكد من هذه العملية")) {
      dispatch(deleteCommuneAction(id));
    }
  };

  const updateHandler = () => {
    dispatch(
      updateCommuneAction(
        editCommuneId,
        editCommuneCode,
        editCommuneNomAr,
        editCommuneNomFr,
        editCommuneCodeWilaya
      )
    );
  };

  const addHandler = () => {
    dispatch(
      addCommuneAction(
        addCommuneCode,
        addCommuneNomAr,
        addCommuneNomFr,
        addCommuneCodeWilaya
      )
    );
  };

  const updateButtonHandler = (event, commune) => {
    event.preventDefault();
    setEditCommuneId(commune._id);
    setEditCommuneCode(commune.code);
    setEditCommuneNomAr(commune.nomAr);
    setEditCommuneNomFr(commune.nomFr);
    setEditCommuneCodeWilaya(commune.codeWilaya);
  };

  const backButtonHandler = (event) => {
    event.preventDefault();
    setEditCommuneId(null);
    setEditCommuneCode(null);
    setEditCommuneNomAr(null);
    setEditCommuneNomFr(null);
    setEditCommuneCodeWilaya(null);

    setAddCommuneId(false);
    setAddCommuneCode("");
    setAddCommuneNomAr("");
    setAddCommuneNomFr("");
    setAddCommuneCodeWilaya("");
  };

  const readCommune = (communeMap) => {
    return (
      <tr>
        <td className="col-2">{communeMap.code}</td>
        <td className="col-3">{communeMap.nomAr}</td>
        <td className="col-3">{communeMap.nomFr}</td>
        <td className="col-2">{communeMap.codeWilaya}</td>
        <td className="col-2">
          <Button
            variant="success"
            className="mx-1"
            onClick={(e) => updateButtonHandler(e, communeMap)}
          >
            تعديل
          </Button>
          <Button
            variant="danger"
            className="mx-1"
            onClick={(e) => deleteHandler(e, communeMap._id)}
          >
            حذف
          </Button>
        </td>
      </tr>
    );
  };

  const editCommune = (communeMap) => {
    return (
      <tr>
        <td className="col-2">
          <input
            type={"text"}
            required
            placeholder="الدخل رمز البلدية "
            name="code"
            value={editCommuneCode}
            onChange={(e) => setEditCommuneCode(e.target.value)}
          ></input>
        </td>
        <td className="col-4">
          <input
            type={"text"}
            required
            placeholder="الدخل اسم البلدية بالعربية "
            name="nomAr"
            value={editCommuneNomAr}
            onChange={(e) => setEditCommuneNomAr(e.target.value)}
          ></input>
        </td>
        <td className="col-4">
          <input
            type={"text"}
            required
            placeholder="الدخل اسم البلدية بالفرنيسة "
            name="nomFr"
            value={editCommuneNomFr}
            onChange={(e) => setEditCommuneNomFr(e.target.value)}
          ></input>
        </td>
        <td>
          <select
            required
            name="codeWilaya"
            onChange={(e) => setEditCommuneCodeWilaya(e.target.value)}
            id="codeWilaya"
            defaultValue="-1"
          >
            <option value="-1" disabled hidden>
              اختر بلدية الميلاد
            </option>
            {wilayas?.map((wilaya) => (
              <option key={wilaya._id} value={wilaya.code}>
                {wilaya.nomAr}
              </option>
            ))}
          </select>
        </td>
        <td className="col-2">
          <Button
            variant="success"
            className="mx-1"
            onClick={() => updateHandler()}
          >
            تثبيت
          </Button>
          <Button
            variant="success"
            className="mx-1"
            onClick={(e) => backButtonHandler(e)}
          >
            الغاء
          </Button>
        </td>
      </tr>
    );
  };

  const addCommune = () => {
    return (
      <tr>
        <td className="col-3">
          <input
            type={"text"}
            required
            placeholder="الدخل رمز البلدية "
            name="code"
            value={addCommuneCode}
            onChange={(e) => setAddCommuneCode(e.target.value)}
          ></input>
        </td>
        <td className="col-5">
          <input
            type={"text"}
            required
            placeholder="الدخل اسم البلدية بالعربية "
            name="nom"
            value={addCommuneNomAr}
            onChange={(e) => setAddCommuneNomAr(e.target.value)}
          ></input>
        </td>
        <td className="col-2">
          <input
            type={"text"}
            required
            placeholder="الدخل اسم البلدية بالفرنيسة "
            name="communes"
            value={addCommuneNomFr}
            onChange={(e) => setAddCommuneNomFr(e.target.value)}
          ></input>
        </td>
        <td>
          <select
            required
            name="codeWilaya"
            onChange={(e) => setAddCommuneCodeWilaya(e.target.value)}
            id="codeWilaya"
            defaultValue="-1"
          >
            <option value="-1" disabled hidden>
              اختر بلدية الميلاد
            </option>
            {wilayas?.map((wilaya) => (
              <option key={wilaya._id} value={wilaya.code}>
                {wilaya.nomAr}
              </option>
            ))}
          </select>
        </td>
        <td className="col-2">
          <Button
            variant="success"
            className="mx-1"
            onClick={() => addHandler()}
          >
            تثبيت
          </Button>
          <Button
            variant="success"
            className="mx-1"
            onClick={(e) => backButtonHandler(e)}
          >
            الغاء
          </Button>
        </td>
      </tr>
    );
  };

  return (
    <MainScreen title={"جدول البلديات المعمول به"}>
      {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
      {loading && <Loading />}

      {errorDelete && (
        <ErrorMessage variant="danger">{errorDelete}</ErrorMessage>
      )}
      {loadingDelete && <Loading />}

      {errorUpdate && (
        <ErrorMessage variant="danger">{errorUpdate}</ErrorMessage>
      )}
      {loadingUpdate && <Loading />}

      {errorAdd && <ErrorMessage variant="danger">{errorAdd}</ErrorMessage>}
      {loadingAdd && <Loading />}

      {errorWilayas && (
        <ErrorMessage variant="danger">{errorWilayas}</ErrorMessage>
      )}
      {loadingWilayas && <Loading />}

      <Card.Header>
        <Button onClick={() => setAddCommuneId(true)}>اضافة بلدية جديدة</Button>
      </Card.Header>
      <Card.Body>
        <Container>
          <Form>
            <Table>
              <thead>
                <tr>
                  <th>رمز البلدية</th>
                  <th>اسم البلدية بالعربية</th>
                  <th>اسم البلدية بالفرنيسة</th>
                  <th>الولاية التابعة</th>
                  <th></th>
                </tr>
              </thead>
              {communes?.map((communeMap) => (
                <tbody key={communeMap._id}>
                  {editCommuneId === communeMap._id
                    ? editCommune(communeMap)
                    : readCommune(communeMap)}
                </tbody>
              ))}
              <tbody>{addCommuneId ? addCommune() : null}</tbody>
            </Table>
          </Form>
        </Container>
      </Card.Body>
    </MainScreen>
  );
}

export default Commune;
