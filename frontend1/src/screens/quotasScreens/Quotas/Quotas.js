import React, { useEffect, useState } from "react";
import { Accordion, Button, Card, Container, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import MainScreen from "../../../components/MainScreen/MainScreen";
import { deleteUserAction, listUsers } from "../../../actions/userActions";
import ErrorMessage from "../../../components/ErrorMessage";
import Loading from "../../../components/Loading";

function Users() {
  const [search, setSearch] = useState("");

  const dispatch = useDispatch();

  const userList = useSelector((state) => state.userList);
  const { loading, users, error } = userList;

  const userDelete = useSelector((state) => state.userDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = userDelete;

  useEffect(() => {
    dispatch(listUsers());
  }, [dispatch, successDelete]);

  const deleteHandler = (id) => {
    if (window.confirm("هل انت متاكد من هذه العملية")) {
      dispatch(deleteUserAction(id));
    }
  };

  return (
    <MainScreen title="عرض كل المستخدمين">
      <div>
        {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
        {loading && <Loading />}

        {errorDelete && (
          <ErrorMessage variant="danger">{errorDelete}</ErrorMessage>
        )}
        {loadingDelete && <Loading />}
        <Container fluid>
          <Form className="d-flex">
            <Button className="w-50 m-2" href="/addUser">
              اضافة مستخدم جديد
            </Button>
            <hr />
            <Form.Control
              type="search"
              placeholder="بحث"
              className="m-2"
              aria-label="Search"
              onChange={(e) => setSearch(e.target.value)}
            />
          </Form>
        </Container>

        {users
          ?.reverse()
          .filter((filtredUsers) =>
            filtredUsers.username.toLowerCase().includes(search.toLowerCase())
          )
          .map((dossierMap) => (
            <Accordion key={dossierMap?._id}>
              <Accordion.Item eventKey={dossierMap?._id} className="m-2">
                <Card.Header className="d-flex">
                  <Accordion.Header
                    style={{
                      color: "black",
                      textDecoration: "none",
                      flex: 1,
                      cursor: "pointer",
                      alignSelf: "center",
                      fontSize: 18,
                    }}
                  >
                    المستخدم : {dossierMap?.username}
                  </Accordion.Header>

                  <div>
                    <Button
                      href={`/updateUser/${dossierMap?._id}`}
                      variant="success"
                      className="mx-2"
                    >
                      تعديل
                    </Button>
                    <Button
                      onClick={() => deleteHandler(dossierMap?._id)}
                      variant="danger"
                      className="mx-2"
                    >
                      حذف
                    </Button>
                  </div>
                </Card.Header>

                <Accordion.Body>
                  <blockquote>
                    <table className="table table-hover">
                      <tbody>
                        <tr>
                          <th scope="col">اسم المستخدم</th>
                          <th className={dossierMap?.username} scope="row">
                            {dossierMap?.username}
                          </th>
                        </tr>
                        <tr>
                          <th scope="col">الاسم</th>
                          <td className={dossierMap?.firstname}>
                            {dossierMap?.firstname}
                          </td>
                        </tr>
                        <tr>
                          <th scope="col">اللقب</th>
                          <td className={dossierMap?.lastname}>
                            {dossierMap?.lastname}
                          </td>
                        </tr>
                        <tr>
                          <th scope="col">تاريخ الميلاد</th>
                          <td className={dossierMap?.birtday}>
                            {dossierMap?.birthday?.substring(0, 10)}
                          </td>
                        </tr>

                        <tr>
                          <th scope="col">البريد الالكتروني</th>
                          <td className={dossierMap?.email}>
                            {dossierMap?.email}
                          </td>
                        </tr>
                        <tr>
                          <th scope="col">الهاتف</th>
                          <td className={dossierMap?.phone}>
                            {dossierMap?.phone}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </blockquote>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          ))}
      </div>
    </MainScreen>
  );
}

export default Users;
