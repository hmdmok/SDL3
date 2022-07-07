import React, { useEffect, useState } from "react";
import { Button, Card, Container, Form, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import MainScreen from "../../../components/MainScreen/MainScreen";
import {
  addNoteAction,
  deleteNoteAction,
  listNotesAction,
  updateNoteAction,
} from "../../../actions/noteActions";
import ErrorMessage from "../../../components/ErrorMessage";
import Loading from "../../../components/Loading";

function TableNotes() {
  const [editNoteId, setEditNoteId] = useState(null);
  const [editNoteCode, setEditNoteCode] = useState(null);
  const [editNoteNom, setEditNoteNom] = useState(null);
  const [editNoteNotes, setEditNoteNotes] = useState(null);

  const [addNoteId, setAddNoteId] = useState(false);
  const [addNoteCode, setAddNoteCode] = useState("");
  const [addNoteNom, setAddNoteNom] = useState("");
  const [addNoteNotes, setAddNoteNotes] = useState("");
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const noteList = useSelector((state) => state.noteList);
  const { loading, notes, error } = noteList;

  const noteDelete = useSelector((state) => state.noteDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = noteDelete;

  const noteUpdate = useSelector((state) => state.noteUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = noteUpdate;

  const noteAdd = useSelector((state) => state.noteAdd);
  const { loading: loadingAdd, error: errorAdd, success: successAdd } = noteAdd;

  useEffect(() => {
    dispatch(listNotesAction());
    if (successUpdate) {
      setEditNoteId(null);
      setEditNoteCode(null);
      setEditNoteNom(null);
      setEditNoteNotes(null);
    }
    if (successAdd) {
      setAddNoteId(false);
      setAddNoteCode("");
      setAddNoteNom("");
      setAddNoteNotes("");
    }
  }, [dispatch, successDelete, successUpdate, successAdd]);

  const deleteHandler = (e, id) => {
    e.preventDefault();
    if (window.confirm("هل انت متاكد من هذه العملية")) {
      dispatch(deleteNoteAction(id));
    }
  };

  const updateHandler = () => {
    dispatch(
      updateNoteAction(editNoteId, editNoteNotes, editNoteCode, editNoteNom)
    );
  };

  const addHandler = () => {
    dispatch(addNoteAction(addNoteNotes, addNoteCode, addNoteNom));
  };

  const updateButtonHandler = (event, note) => {
    event.preventDefault();
    setEditNoteId(note._id);
    setEditNoteCode(note.code);
    setEditNoteNom(note.nom);
    setEditNoteNotes(note.notes);
  };

  const backButtonHandler = (event) => {
    event.preventDefault();
    setEditNoteId(null);
    setEditNoteCode(null);
    setEditNoteNom(null);
    setEditNoteNotes(null);

    setAddNoteId(false);
    setAddNoteCode("");
    setAddNoteNom("");
    setAddNoteNotes("");
  };

  const readNote = (noteMap) => {
    return (
      <tr>
        {userInfo.usertype === "super" ? (
          <td className="col-3 h3">{noteMap.code}</td>
        ) : null}
        <td className="h3">{noteMap.nom}</td>
        <td className="col-2 h4">{noteMap.notes}</td>
        <td className="col-2">
          {userInfo.usertype === "super" ? (
            <>
              <Button
                variant="success"
                className="mx-1"
                onClick={(e) => updateButtonHandler(e, noteMap)}
              >
                تعديل
              </Button>
              <Button
                variant="danger"
                className="mx-1"
                onClick={(e) => deleteHandler(e, noteMap._id)}
              >
                حذف
              </Button>
            </>
          ) : null}
        </td>
      </tr>
    );
  };

  const editNote = (noteMap) => {
    return (
      <tr>
        <td className="col-3">
          <input
            type={"text"}
            required
            placeholder="الدخل الرمز "
            name="code"
            value={editNoteCode}
            onChange={(e) => setEditNoteCode(e.target.value)}
          ></input>
        </td>
        <td className="col-5">
          <input
            type={"text"}
            required
            placeholder="الدخل التعريف "
            name="nom"
            value={editNoteNom}
            onChange={(e) => setEditNoteNom(e.target.value)}
          ></input>
        </td>
        <td className="col-2">
          <input
            type={"text"}
            required
            placeholder="الدخل النقاط "
            name="notes"
            value={editNoteNotes}
            onChange={(e) => setEditNoteNotes(e.target.value)}
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

  const addNote = () => {
    return (
      <tr>
        <td className="col-3">
          <input
            type={"text"}
            required
            placeholder="الدخل الرمز "
            name="code"
            value={addNoteCode}
            onChange={(e) => setAddNoteCode(e.target.value)}
          ></input>
        </td>
        <td className="col-5">
          <input
            type={"text"}
            required
            placeholder="الدخل التعريف "
            name="nom"
            value={addNoteNom}
            onChange={(e) => setAddNoteNom(e.target.value)}
          ></input>
        </td>
        <td className="col-2">
          <input
            type={"text"}
            required
            placeholder="الدخل النقاط "
            name="notes"
            value={addNoteNotes}
            onChange={(e) => setAddNoteNotes(e.target.value)}
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
    <MainScreen title={"جدول النقاط المعمول به"}>
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
        {userInfo.usertype === "super" ? (
          <Button onClick={() => setAddNoteId(true)}>اضافة نقطة جديدة</Button>
        ) : null}
      </Card.Header>
      <Card.Body>
        <Container>
          <Form>
            <Table>
              <thead>
                <tr className="h2">
                  <th>الرمز</th>
                  <th>التعريف</th>
                  <th>النقاط</th>
                  <th></th>
                </tr>
              </thead>
              {notes?.map((noteMap) => (
                <tbody key={noteMap._id}>
                  {editNoteId === noteMap._id
                    ? editNote(noteMap)
                    : readNote(noteMap)}
                </tbody>
              ))}
              <tbody>{addNoteId ? addNote() : null}</tbody>
            </Table>
          </Form>
        </Container>
      </Card.Body>
    </MainScreen>
  );
}

export default TableNotes;
