import React, { useEffect, useState } from "react";
import { Button, Card, Container, Form, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import ErrorMessage from "../../../components/ErrorMessage";
import Loading from "../../../components/Loading";
import MainScreen from "../../../components/MainScreen/MainScreen";
import {
  addWilayaAction,
  deleteWilayaAction,
  listWilayasAction,
  updateWilayaAction,
} from "../../../actions/wilayaActions";

function Willaya() {
  const [editWilayaId, setEditWilayaId] = useState(null);
  const [editWilayaCode, setEditWilayaCode] = useState(null);
  const [editWilayaNomAr, setEditWilayaNomAr] = useState(null);
  const [editWilayaNomFr, setEditWilayaNomFr] = useState(null);

  const [addWilayaId, setAddWilayaId] = useState(false);
  const [addWilayaCode, setAddWilayaCode] = useState("");
  const [addWilayaNomAr, setAddWilayaNomAr] = useState("");
  const [addWilayaNomFr, setAddWilayaNomFr] = useState("");
  const dispatch = useDispatch();

  const wilayaList = useSelector((state) => state.wilayaList);
  const { loading, wilayas, error } = wilayaList;

  const wilayaDelete = useSelector((state) => state.wilayaDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = wilayaDelete;

  const wilayaUpdate = useSelector((state) => state.wilayaUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = wilayaUpdate;

  const wilayaAdd = useSelector((state) => state.wilayaAdd);
  const {
    loading: loadingAdd,
    error: errorAdd,
    success: successAdd,
  } = wilayaAdd;

  useEffect(() => {
    dispatch(listWilayasAction());
    if (successUpdate) {
      setEditWilayaId(null);
      setEditWilayaCode(null);
      setEditWilayaNomAr(null);
      setEditWilayaNomFr(null);
    }
    if (successAdd) {
      setAddWilayaId(false);
      setAddWilayaCode("");
      setAddWilayaNomAr("");
      setAddWilayaNomAr("");
    }
  }, [dispatch, successDelete, successUpdate, successAdd]);

  const deleteHandler = (e, id) => {
    e.preventDefault();
    if (window.confirm("هل انت متاكد من هذه العملية")) {
      dispatch(deleteWilayaAction(id));
    }
  };

  const updateHandler = () => {
    dispatch(
      updateWilayaAction(
        editWilayaId,
        editWilayaCode,
        editWilayaNomAr,
        editWilayaNomFr
      )
    );
  };

  const addHandler = () => {
    dispatch(addWilayaAction(addWilayaCode, addWilayaNomAr, addWilayaNomFr));
  };

  const updateButtonHandler = (event, wilaya) => {
    event.preventDefault();
    setEditWilayaId(wilaya._id);
    setEditWilayaCode(wilaya.code);
    setEditWilayaNomAr(wilaya.nomAr);
    setEditWilayaNomFr(wilaya.nomFr);
  };

  const backButtonHandler = (event) => {
    event.preventDefault();
    setEditWilayaId(null);
    setEditWilayaCode(null);
    setEditWilayaNomAr(null);
    setEditWilayaNomFr(null);

    setAddWilayaId(false);
    setAddWilayaCode("");
    setAddWilayaNomAr("");
    setAddWilayaNomFr("");
  };

  const readWilaya = (wilayaMap) => {
    return (
      <tr>
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

        <td className="col-2">{wilayaMap.code}</td>
        <td>{wilayaMap.nomAr}</td>
        <td className="col-4">{wilayaMap.nomFr}</td>
        <td className="col-2">
          <Button
            variant="success"
            className="mx-1"
            onClick={(e) => updateButtonHandler(e, wilayaMap)}
          >
            تعديل
          </Button>
          <Button
            variant="danger"
            className="mx-1"
            onClick={(e) => deleteHandler(e, wilayaMap._id)}
          >
            حذف
          </Button>
        </td>
      </tr>
    );
  };

  const editWilaya = (wilayaMap) => {
    return (
      <tr>
        <td className="col-2">
          <input
            type={"text"}
            required
            placeholder="الدخل رمز الولاية "
            name="code"
            value={editWilayaCode}
            onChange={(e) => setEditWilayaCode(e.target.value)}
          ></input>
        </td>
        <td className="col-4">
          <input
            type={"text"}
            required
            placeholder="الدخل اسم الولاية بالعربية "
            name="nomAr"
            value={editWilayaNomAr}
            onChange={(e) => setEditWilayaNomAr(e.target.value)}
          ></input>
        </td>
        <td className="col-4">
          <input
            type={"text"}
            required
            placeholder="الدخل اسم الولاية بالفرنيسة "
            name="nomFr"
            value={editWilayaNomFr}
            onChange={(e) => setEditWilayaNomFr(e.target.value)}
          ></input>
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

  const addWilaya = () => {
    return (
      <tr>
        <td className="col-3">
          <input
            type={"text"}
            required
            placeholder="الدخل رمز الولاية "
            name="code"
            value={addWilayaCode}
            onChange={(e) => setAddWilayaCode(e.target.value)}
          ></input>
        </td>
        <td className="col-5">
          <input
            type={"text"}
            required
            placeholder="الدخل اسم الولاية بالعربية "
            name="nom"
            value={addWilayaNomFr}
            onChange={(e) => setAddWilayaNomAr(e.target.value)}
          ></input>
        </td>
        <td className="col-2">
          <input
            type={"text"}
            required
            placeholder="الدخل اسم الولاية بالفرنيسة "
            name="wilayas"
            value={addWilayaNomFr}
            onChange={(e) => setAddWilayaNomFr(e.target.value)}
          ></input>
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
    <MainScreen title={"جدول اسم الولاية بالفرنيسة المعمول به"}>
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

      <Card.Header>
        <Button onClick={() => setAddWilayaId(true)}>اضافة ولاية جديدة</Button>
      </Card.Header>
      <Card.Body>
        <Container>
          <Form>
            <Table>
              <thead>
                <tr>
                  <th>رمز الولاية</th>
                  <th>اسم الولاية بالعربية</th>
                  <th>اسم الولاية بالفرنيسة</th>
                  <th></th>
                </tr>
              </thead>
              {wilayas?.map((wilayaMap) => (
                <tbody key={wilayaMap._id}>
                  {editWilayaId === wilayaMap._id
                    ? editWilaya(wilayaMap)
                    : readWilaya(wilayaMap)}
                </tbody>
              ))}
              <tbody>{addWilayaId ? addWilaya() : null}</tbody>
            </Table>
          </Form>
        </Container>
      </Card.Body>
    </MainScreen>
  );
}

export default Willaya;
