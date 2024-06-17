import React, { useEffect, useState } from "react";
import { Accordion, Button, Card, Container, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import MainScreen from "../../../components/MainScreen/MainScreen";
import { deleteQuotaAction, listQuotas } from "../../../actions/quotaActions";
import ErrorMessage from "../../../components/ErrorMessage";
import Loading from "../../../components/Loading";

function Quotas() {
  const [search, setSearch] = useState("");

  const dispatch = useDispatch();

  const quotaList = useSelector((state) => state.quotaList);
  const { loading, quotas, error } = quotaList;

  const quotaDelete = useSelector((state) => state.quotaDelete);
  const {
    loading: loadingDelete,
    error: errorDelete,
    success: successDelete,
  } = quotaDelete;

  useEffect(() => {
    dispatch(listQuotas());
  }, [dispatch, successDelete]);

  const deleteHandler = (id) => {
    if (window.confirm("هل انت متاكد من هذه العملية")) {
      dispatch(deleteQuotaAction(id));
    }
  };

  return (
    <MainScreen title="عرض كل الحصص">
      <div>
        {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
        {loading && <Loading />}

        {errorDelete && (
          <ErrorMessage variant="danger">{errorDelete}</ErrorMessage>
        )}
        {loadingDelete && <Loading />}
        <Container fluid>
          <Form className="d-flex">
            <Button className="w-50 m-2" href="/addQuota">
              اضافة حصة جديد
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

        {quotas
          ?.reverse()
          .filter((filtredQuotas) =>
            filtredQuotas.quotaname.toLowerCase().includes(search.toLowerCase())
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
                    الحصة : {dossierMap?.quotaname}
                  </Accordion.Header>

                  <div>
                    <Button
                      href={`/updateQuota/${dossierMap?._id}`}
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
                          <th scope="col">اسم الحصة</th>
                          <th className={dossierMap?.quotaname} scope="row">
                            {dossierMap?.quotaname}
                          </th>
                        </tr>
                        <tr>
                          <th scope="col">اسم الحصة بالفرنسية</th>
                          <td className={dossierMap?.quotanameFr}>
                            {dossierMap?.quotanameFr}
                          </td>
                        </tr>
                        <tr>
                          <th scope="col">تاريخ الحصة</th>
                          <td className={dossierMap?.quotadate}>
                            {dossierMap?.quotadate?.substring(0, 10)}
                          </td>
                        </tr>
                        <tr>
                          <th scope="col">عدد السكنات للحصة</th>
                          <td className={dossierMap?.quotaquant}>
                            {dossierMap?.quotaquant}
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

export default Quotas;
