import React, { useEffect, useState } from "react";
import { Accordion, Badge, Button, Card, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import MainScreen from "../../../components/MainScreen/MainScreen";
import {
  deleteDossierAction,
  listDossiersAction,
} from "../../../actions/dossierActions";
import { addFile, deleteFile } from "../../../actions/filesActions";
import ErrorMessage from "../../../components/ErrorMessage";
import Loading from "../../../components/Loading";

function Dossiers() {
  const [search, setSearch] = useState("");
  const [nameSearch, setNameSearch] = useState("");
  const [lastNameSearch, setLastNameSearch] = useState("");
  const [birthDateSearch, setBirthDateSearch] = useState("");
  const [fromDate, setFromDate] = useState(
    new Date("01/01/1900").toLocaleDateString()
  );
  const [toDate, setToDate] = useState(new Date().toLocaleDateString());
  const [dossiersCount, setDossiersCount] = useState(50);
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const filesToCheck = useSelector((state) => state.filesToCheck);
  const { filesInfo } = filesToCheck;
  const { files } = filesInfo;

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

  const addDossierToCheck = (fileTo) => {
    dispatch(addFile(fileTo));
  };

  const dellDossierFromCheck = (fileTo) => {
    dispatch(deleteFile(fileTo));
  };

  useEffect(() => {
    dispatch(
      listDossiersAction(
        dossiersCount,
        search,
        lastNameSearch,
        nameSearch,
        birthDateSearch,
        fromDate,
        toDate
      )
    );
  }, [
    dispatch,
    successDossierDelete,
    search,
    lastNameSearch,
    nameSearch,
    birthDateSearch,
    dossiersCount,
    fromDate,
    toDate,
  ]);

  return (
    <MainScreen title={" عرض كل الملفات الموجودة"}>
      {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
      {loading && <Loading />}

      {errorDossierDelete && (
        <ErrorMessage variant="danger">{errorDossierDelete}</ErrorMessage>
      )}
      {loadingDossierDelete && <Loading />}

      <div>
        <div className="row">
          <Link className="col" to="/demandeur">
            <Button>اضافة ملف جديد</Button>
          </Link>
          <Button variant="success" className="col">
            <Badge>ملف</Badge>
            <Badge>{dossiers?.length}</Badge>
          </Button>
        </div>
        <div className="row">
          <Form.Label className="text-right col-2 order-12">
            {" "}
            عدد الملفات للبحث
          </Form.Label>
          <Form.Control
            type="search"
            defaultValue={dossiersCount}
            className="m-1 col text-right"
            aria-label="Search"
            onChange={(e) => {
              setDossiersCount(e.target.value);
            }}
          />
        </div>

        <div className="row m-0">
          <div className="d-flex col-6  order-last">
            <Form.Label htmlFor="inputFromDate" className="text-right col-3">
              {"من"}
            </Form.Label>
            <Form.Control
              value={new Date(fromDate).toISOString().split("T")[0]}
              name="fromDate"
              onChange={(e) => {
                setFromDate(new Date(e.target.value).toLocaleDateString());
              }}
              type="date"
              id="inputFromDate"
              className="m-1 text-right col order-first"
              autoFocus
            />
          </div>
          <div className="d-flex col-6 order-first">
            <Form.Label htmlFor="inputToDate" className="text-right col-3 ">
              {"الى"}
            </Form.Label>
            <Form.Control
              value={new Date(toDate).toISOString().split("T")[0]}
              name="toDate"
              onChange={(e) =>
                setToDate(new Date(e.target.value).toLocaleDateString())
              }
              type="date"
              id="inputToDate"
              className="m-1 text-right col order-first"
            />
          </div>
        </div>
        <div className="row">
          {!nameSearch && !lastNameSearch && !birthDateSearch && (
            <Form.Control
              type="search"
              placeholder="ادخل رقم الملف للبحث"
              className="m-1 col text-right"
              aria-label="Search"
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
          )}
        </div>
        {!search && (
          <div className="row">
            <Form.Control
              type="search"
              placeholder="ادخل اسم الشخص للبحث"
              className="m-1 col text-right"
              aria-label="NameSearch"
              onChange={(e) => {
                setNameSearch(e.target.value);
              }}
            />
            <Form.Control
              type="search"
              placeholder="ادخل لقب الشخص للبحث"
              className="m-1 col text-right"
              aria-label="lastNameSearch"
              onChange={(e) => {
                setLastNameSearch(e.target.value);
              }}
            />
            <Form.Control
              type="search"
              placeholder="ادخل تاريخ ميلاد الشخص للبحث"
              className="m-1 col text-right"
              aria-label="birthDateSearch"
              onChange={(e) => {
                setBirthDateSearch(e.target.value);
              }}
            />
          </div>
        )}

        {dossiers
          ?.sort(function (a, b) {
            return b.notes - a.notes;
          })
          .filter((filtredDossiers) => {
            return filtredDossiers?.num_dos
              .toLowerCase()
              .includes(search?.toLowerCase());
          })
          .map((dossierMap, i, passed) => {
            return (
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
                      Nom: {dossierMap.demandeur.nom_fr} || Prenom:{" "}
                      {dossierMap.demandeur.prenom_fr} || Date de naissance:{" "}
                      {dossierMap.demandeur.date_n} || Dossier num:{" "}
                      {dossierMap.num_dos}
                    </Accordion.Header>

                    <div>
                      <Button
                        href={`/adddossiers/${dossierMap._id}`}
                        variant="success"
                        className="mx-2"
                      >
                        تعديل الملف
                      </Button>
                      {files?.some((f) => f._id === dossierMap._id) ? (
                        <Button
                          variant="success"
                          className="mx-2"
                          onClick={() => dellDossierFromCheck(dossierMap)}
                        >
                          حذف الملف من التحقيق
                        </Button>
                      ) : (
                        <Button
                          variant="success"
                          className="mx-2"
                          onClick={() => addDossierToCheck(dossierMap)}
                        >
                          اظافة الملف للتحقيق
                        </Button>
                      )}

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
            );
          })}
      </div>
    </MainScreen>
  );
}

export default Dossiers;
