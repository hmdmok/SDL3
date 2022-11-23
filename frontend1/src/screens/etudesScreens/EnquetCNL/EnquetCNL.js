import React, { useEffect, useState } from "react";
import ErrorMessage from "../../../components/ErrorMessage";
// import ReactHTMLTableToExcel from "react-html-table-to-excel";
import MainScreen from "../../../components/MainScreen/MainScreen";
// import { Table } from "react-bootstrap";

import { Accordion, Button, Card, Form } from "react-bootstrap";
// import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { listEnquetCNLsAction } from "../../../actions/enquetCNLActions";
import Loading from "../../../components/Loading";

function EnquetCNL() {
  const dispatch = useDispatch();
  // const userLogin = useSelector((state) => state.userLogin);
  // const { userInfo } = userLogin;
  const [dateMessage, setdateMessage] = useState("");
  const [listDossierEnquet, setListDossierEnquet] = useState([]);

  const [form, setForm] = useState({
    fromDate: "1999-01-01",
    toDate: new Date().toISOString().split("T")[0],
  });
  const enquetCNLList = useSelector((state) => state.enquetCNLList);
  const { loading, enquetCNLs: dossierEnq, error } = enquetCNLList;

  const onUpload = () => {
    dispatch(listEnquetCNLsAction(form.fromDate, form.toDate));
  };

  useEffect(() => {
    if (dossierEnq) {
      setListDossierEnquet(
        dossierEnq?.map((dossiermap) => {
          return { dossier: dossiermap, checked: true };
        })
      );
    }
  }, [dispatch, dossierEnq]);

  const handleSelect = (event, dossier) => {
    const value = dossier;
    const isChecked = event.target.checked;

    if (isChecked) {
      //Add checked item into checkList
      setListDossierEnquet([...listDossierEnquet, value]);
      console.log(listDossierEnquet);
    } else {
      //Remove unchecked item from checkList
      const filteredList = listDossierEnquet.filter((item) => item.dossier._id !== value._id);
      setListDossierEnquet(filteredList);
      console.log(listDossierEnquet);
    }
  };

  useEffect(() => {
    if (form.fromDate > form.toDate) setdateMessage("خطاء في ادخال التاريخ");
    else setdateMessage("");
  }, [form]);

  const onHandleChange = (event) => {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <MainScreen title={"تحقيق CNL"}>
      {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
      {loading && <Loading />}

      <h1 className="text-right">الرجاء ادخال تاريخ ايداع الملفات</h1>
      {dateMessage && (
        <ErrorMessage variant="danger">{dateMessage}</ErrorMessage>
      )}
      <div className="row text-right">
        <div className="col-5 order-last">
          <label htmlFor="inputFromDate" className="text-right">
            {"من"}
          </label>
          <input
            value={form.fromDate}
            name="fromDate"
            onChange={(e) => onHandleChange(e)}
            type="date"
            id="inputFromDate"
            className="form-control text-right"
            autoFocus
          />
        </div>
        <div className="col-5">
          <label htmlFor="inputToDate" className="text-right">
            {"الى"}
          </label>
          <input
            value={form.toDate}
            name="toDate"
            onChange={(e) => onHandleChange(e)}
            type="date"
            id="inputToDate"
            className="form-control text-right"
          />
        </div>
        <div className="col-2 order-first">
          <button
            onClick={(e) => onUpload(e)}
            className="btn btn-primary btn-block mt-4"
          >
            اختيار
          </button>
        </div>
      </div>
      <br />
      <h1 className="text-right">الرجاء تحديد الملفات للتحقيق</h1>
      <br />
      {listDossierEnquet?.map((dossierMap) => (
        <Accordion key={dossierMap.dossier?._id}>
          <Accordion.Item
            eventKey={dossierMap.dossier?._id}
            className="align-middle m-2"
          >
            <Form.Check
              onChange={(e) => handleSelect(e, dossierMap.dossier)}
              aria-label="option 1"
              id={`default-${dossierMap.dossier?._id}`}
              checked={dossierMap.checked}
            />
            <Card.Header className="">
              <Accordion.Header
                style={{
                  color: "black",
                  textDecoration: "none",
                  flex: 1,
                  cursor: "pointer",
                  alignSelf: "center",
                  fontSize: 18,
                }}
                className="text-right"
              >
                {`الملف رقم : ${dossierMap.dossier?.num_dos} /  
                 اسم طالب السكن : ${dossierMap.dossier?.demandeur[0]?.nom}
                ;  ${dossierMap.dossier?.demandeur[0]?.prenom} /n `}
                {dossierMap.dossier?.conjoin[0]
                  ? `
                 اسم الزوجة : ${dossierMap.dossier?.conjoin[0]?.nom}
                 . ${dossierMap.dossier?.conjoin[0]?.prenom}`
                  : null}
              </Accordion.Header>
            </Card.Header>

            <Accordion.Body>
              <blockquote>
                <Button
                  href={`/demandeur/${dossierMap.dossier?._id}`}
                  variant="success"
                  className="mx-2"
                >
                  {"تعديل معلومات طالب السكن"}
                </Button>

                <table className="table table-hover">
                  <tbody>
                    <tr>
                      <th scope="col">تاريخ الايداع</th>
                      <td>{dossierMap.dossier?.date_depo}</td>
                    </tr>
                    <tr>
                      <th scope="col">عدد الاولاد</th>
                      <td>{dossierMap.dossier?.num_enf}</td>
                    </tr>
                    <tr>
                      <th scope="col">من ذوي الحقوق</th>
                      <td>{dossierMap.dossier?.stuation_s_avec_d ? "نعم" : "لا"}</td>
                    </tr>
                    <tr>
                      <th scope="col">من ذوي الهمم</th>
                      <td>{dossierMap.dossier?.stuation_s_andicap ? "نعم" : "لا"}</td>
                    </tr>
                    <tr>
                      <th scope="col">وضعية الاقامة الحالية</th>
                      <td>{dossierMap.dossier?.stuation_d}</td>
                    </tr>
                    <tr>
                      <th scope="col">عدد الاشخاص المتكفل بهم</th>
                      <td>{dossierMap.dossier?.numb_p}</td>
                    </tr>
                    <tr>
                      <th scope="col">الملاحظات</th>
                      <td>{dossierMap.dossier?.remark}</td>
                    </tr>
                    <tr>
                      <th scope="col">التنقيط</th>
                      <td>{dossierMap.dossier?.notes}</td>
                    </tr>
                  </tbody>
                </table>
              </blockquote>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      ))}
      {/* {dossierEnq.dossierTotal.length !== 0 ? (
        <ReactHTMLTableToExcel
          id="test-table-xls-button"
          className="download-table-xls-button  btn btn-primary mb-3"
          table="data-table"
          filename={
            "Enquet CNL " + new Date().toISOString().split("T")[0] + ".xlsx"
          }
          sheet="Enquet"
          buttonText="تحميل ملف التحقيق"
        />
      ) : null}
      <br />
      <Table striped bordered hover responsive id="data-table">
        <thead className="thead-dark">
          <tr>
            <th scope="col">Ordre</th>
            <th scope="col">Nom</th>
            <th scope="col">Prénom</th>
            <th scope="col">Sexe</th>
            <th scope="col">Date de Naissance</th>
            <th scope="col">Type Date de Naissance</th>
            <th scope="col">Commune de Naissance</th>
            <th scope="col">WILAYA DE NAISSANCE</th>
            <th scope="col">N°EXTR DE NAISSANCE</th>
            <th scope="col">Sit. Fam</th>
            <th scope="col">Prénom du Pére</th>
            <th scope="col">Nom de la Mére</th>
            <th scope="col">Prénom de la Mére</th>
            <th scope="col">Nom Conj</th>
            <th scope="col"> Prénom conj</th>
            <th scope="col"> Date de Naissance conj</th>
            <th scope="col">Type Date de Naissance conj</th>
            <th scope="col">Commune de Naissance conj</th>
            <th scope="col">WILAYA DE NAISSANCE conj</th>
            <th scope="col">N°EXTR DE NAISSANCE conj</th>
            <th scope="col">Prénom du Pére conj</th>
            <th scope="col"> Nom de la Mére conj</th>
            <th scope="col">Prénom de la Mére conj</th>
          </tr>
        </thead>
        <tbody>
          {dossierEnq.dossierTotal.length !== 0
            ? dossierEnq.dossierTotal.map((dossierMap, i) => (
                <tr className={dossierMap.id_dossier} key={i}>
                  <th scope="row">{i + 1}</th>
                  <td>{dossierMap.nom_fr}</td>
                  <td>{dossierMap.prenom_fr}</td>
                  <td>{dossierMap.gender}</td>
                  <td>{dossierMap.date_n.split("T")[0]}</td>
                  <td>{dossierMap.type_date_nais}</td>
                  <td>{dossierMap.nom_commune_fr}</td>
                  <td>{dossierMap.nom_wilaya_fr}</td>
                  <td>{dossierMap.num_act}</td>
                  <td>{dossierMap.stuation_f}</td>
                  <td>{dossierMap.prenom_p_fr}</td>
                  <td>{dossierMap.nom_m_fr}</td>
                  <td>{dossierMap.prenom_m_fr}</td>
                  <td>{dossierMap.conjoin ? dossierMap.conjoin.nom : null}</td>
                  <td>
                    {dossierMap.conjoin ? dossierMap.conjoin.prenom_fr : null}
                  </td>
                  <td>
                    {dossierMap.conjoin
                      ? dossierMap.conjoin.date_n.split("T")[0]
                      : null}
                  </td>
                  <td>
                    {dossierMap.conjoin
                      ? dossierMap.conjoin.type_date_nais
                      : null}
                  </td>
                  <td>
                    {dossierMap.conjoin
                      ? dossierMap.conjoin.nom_commune_fr
                      : null}
                  </td>
                  <td>
                    {dossierMap.conjoin
                      ? dossierMap.conjoin.nom_wilaya_fr
                      : null}
                  </td>
                  <td>
                    {dossierMap.conjoin ? dossierMap.conjoin.num_act : null}
                  </td>
                  <td>
                    {dossierMap.conjoin ? dossierMap.conjoin.prenom_p_fr : null}
                  </td>
                  <td>
                    {dossierMap.conjoin ? dossierMap.conjoin.nom_m_fr : null}
                  </td>
                  <td>
                    {dossierMap.conjoin ? dossierMap.conjoin.prenom_m_fr : null}
                  </td>
                </tr>
              ))
            : null}
        </tbody>
      </Table> */}
    </MainScreen>
  );
}

export default EnquetCNL;
