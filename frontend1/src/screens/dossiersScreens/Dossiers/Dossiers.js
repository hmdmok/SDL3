import React, { useEffect, useState } from "react";
import { Accordion, Button, Card, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MainScreen from "../../../components/MainScreen/MainScreen";
import {
  deleteDossierAction,
  listDossiersAction,
} from "../../../actions/dossierActions";
import ErrorMessage from "../../../components/ErrorMessage";
import Loading from "../../../components/Loading";

function Dossiers() {
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const dossierList = useSelector((state) => state.dossierList);
  const { loading, dossiers, error } = dossierList;

  const dossierDelete = useSelector((state) => state.dossierDelete);
  const {
    loading: loadingDossierDelete,
    success: successDossierDelete,
    error: errorDossierDelete,
  } = dossierDelete;

  const deleteHandler = (id) => {
    dispatch(deleteDossierAction(id));
  };

  useEffect(() => {
    dispatch(listDossiersAction());
  }, [dispatch, successDossierDelete]);

  return (
    <MainScreen title="عرض كل الملفات الموجودة">
      {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
      {loading && <Loading />}

      {errorDossierDelete && (
        <ErrorMessage variant="danger">{errorDossierDelete}</ErrorMessage>
      )}
      {loadingDossierDelete && <Loading />}

      <div>
        <Link to="/demandeur">
          <Button>اضافة ملف جديد</Button>
        </Link>
        <Form.Control
          type="search"
          placeholder="ادخل رقم الملف للبحث"
          className="m-2"
          aria-label="Search"
          onChange={(e) => setSearch(e.target.value)}
        />
        {dossiers
          ?.sort(function (a, b) {
            return b.notes - a.notes;
          })
          .filter((filtredDossiers) =>
            filtredDossiers.num_dos.toLowerCase().includes(search.toLowerCase())
          )
          .map((dossierMap) => (
            <Accordion key={dossierMap._id}>
              <Accordion.Item eventKey={dossierMap._id} className="m-2">
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
                    الملف رقم : {dossierMap.num_dos}
                  </Accordion.Header>

                  <div>
                    <Button
                      href={`/adddossiers/${dossierMap._id}`}
                      variant="success"
                      className="mx-2"
                    >
                      تعديل الملف
                    </Button>
                    {userInfo.usertype === "super" ? (
                      <Button
                        onClick={() => {
                          deleteHandler(dossierMap._id);
                        }}
                        variant="danger"
                        className="mx-2"
                      >
                        حذف
                      </Button>
                    ) : null}
                  </div>
                </Card.Header>

                <Accordion.Body>
                  <blockquote>
                    {dossierMap.scan_dossier === "true" ? (
                      <Button href={"#"} variant="success" className="mx-2">
                        {"تعديل الملف الممسوح"}
                      </Button>
                    ) : (
                      <Button href={"#"} variant="success" className="mx-2">
                        {"مسح الملف "}
                      </Button>
                    )}
                    {dossierMap.saisi_conj === "true" ? (
                      <Button
                        href={`/updateConjoin/${dossierMap?._id}`}
                        variant="success"
                        className="mx-2"
                      >
                        {"(ة)تعديل معلومات الزوج"}
                      </Button>
                    ) : dossierMap.saisi_conj === "false" ? (
                      <Button
                        href={`/conjoin/${dossierMap?._id}`}
                        variant="success"
                        className="mx-2"
                      >
                        {"(ة)ادخال معلومات الزوج"}
                      </Button>
                    ) : null}
                    <Button
                      href={`/demandeur/${dossierMap?._id}`}
                      variant="success"
                      className="mx-2"
                    >
                      {"تعديل معلومات طالب السكن"}
                    </Button>

                    <table className="table table-hover">
                      <tbody>
                        <tr>
                          <th scope="col">تاريخ الايداع</th>
                          <td>{dossierMap.date_depo}</td>
                        </tr>
                        <tr>
                          <th scope="col">عدد الاولاد</th>
                          <td>{dossierMap.num_enf}</td>
                        </tr>
                        <tr>
                          <th scope="col">من ذوي الحقوق</th>
                          <td>{dossierMap.stuation_s_avec_d}</td>
                        </tr>
                        <tr>
                          <th scope="col">من ذوي الهمم</th>
                          <td>{dossierMap.stuation_s_andicap}</td>
                        </tr>
                        <tr>
                          <th scope="col">وضعية الاقامة الحالية</th>
                          <td>{dossierMap.stuation_d}</td>
                        </tr>
                        <tr>
                          <th scope="col">عدد الاشخاص المتكفل بهم</th>
                          <td>{dossierMap.numb_p}</td>
                        </tr>
                        <tr>
                          <th scope="col">الملاحظات</th>
                          <td>{dossierMap.remark}</td>
                        </tr>
                        <tr>
                          <th scope="col">التنقيط</th>
                          <td>{dossierMap.notes}</td>
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

export default Dossiers;
