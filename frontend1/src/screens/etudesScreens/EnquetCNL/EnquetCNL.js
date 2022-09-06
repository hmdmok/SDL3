import React, { useEffect, useState } from "react";
import ErrorMessage from "../../../components/ErrorMessage";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import MainScreen from "../../../components/MainScreen/MainScreen";
import { Table } from "react-bootstrap";

function EnquetCNL() {
  
  const [dateMessage, setdateMessage] = useState("");
  const [form, setForm] = useState({
    fromDate: "1999-01-01",
    toDate: new Date().toISOString().split("T")[0],
  });
  const [dossierEnq, setDossierEnq] = useState({
    resultaDossConjoin: [],
    resultaDossDema: [],
    dossierTotal: [],
  });

  const onUpload = () => {
    fetch("https://sdl-api.herokuapp.com/DossierEnq", {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(form),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          setDossierEnq({ ...data, dossierTotal: [] });
        }
      })
      .catch((err) => setdateMessage(toString(err)));
  };

  useEffect(() => {
    if (
      dossierEnq.dossierTotal.length === 0 &&
      dossierEnq.resultaDossDema.length !== 0
    ) {
      var dossierGlobal = dossierEnq.resultaDossDema;
      if (dossierEnq.resultaDossConjoin.length !== 0)
        dossierEnq.resultaDossConjoin.map((dossConj) => {
          dossierGlobal.map((dossierGlobMap, i) => {
            if (dossConj.id_dossier === dossierGlobMap.id_dossier)
              dossierGlobal[i] = { ...dossierGlobal[i], conjoin: dossConj };
          });
        });
      setDossierEnq({ ...dossierEnq, dossierTotal: dossierGlobal });
    }
  }, [dossierEnq]);

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
      <h1>الرجاء ادخال تاريخ ايداع الملفات</h1>
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
      <h1>الرجاء تحديد الملفات للتحقيق</h1>
      <br />
      {dossierEnq.dossierTotal.length !== 0 ? (
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
      <Table striped bordered responsive id="data-table">
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
                  <td scope="col">{dossierMap.nom_fr}</td>
                  <td scope="col">{dossierMap.prenom_fr}</td>
                  <td scope="col">{dossierMap.gender}</td>
                  <td scope="col">{dossierMap.date_n.split("T")[0]}</td>
                  <td scope="col">{dossierMap.type_date_nais}</td>
                  <td scope="col">{dossierMap.nom_commune_fr}</td>
                  <td scope="col">{dossierMap.nom_wilaya_fr}</td>
                  <td scope="col">{dossierMap.num_act}</td>
                  <td scope="col">{dossierMap.stuation_f}</td>
                  <td scope="col">{dossierMap.prenom_p_fr}</td>
                  <td scope="col">{dossierMap.nom_m_fr}</td>
                  <td scope="col">{dossierMap.prenom_m_fr}</td>
                  <td scope="col">
                    {dossierMap.conjoin ? dossierMap.conjoin.nom : null}
                  </td>
                  <td scope="col">
                    {dossierMap.conjoin ? dossierMap.conjoin.prenom_fr : null}
                  </td>
                  <td scope="col">
                    {dossierMap.conjoin
                      ? dossierMap.conjoin.date_n.split("T")[0]
                      : null}
                  </td>
                  <td scope="col">
                    {dossierMap.conjoin
                      ? dossierMap.conjoin.type_date_nais
                      : null}
                  </td>
                  <td scope="col">
                    {dossierMap.conjoin
                      ? dossierMap.conjoin.nom_commune_fr
                      : null}
                  </td>
                  <td scope="col">
                    {dossierMap.conjoin
                      ? dossierMap.conjoin.nom_wilaya_fr
                      : null}
                  </td>
                  <td scope="col">
                    {dossierMap.conjoin ? dossierMap.conjoin.num_act : null}
                  </td>
                  <td scope="col">
                    {dossierMap.conjoin ? dossierMap.conjoin.prenom_p_fr : null}
                  </td>
                  <td scope="col">
                    {dossierMap.conjoin ? dossierMap.conjoin.nom_m_fr : null}
                  </td>
                  <td scope="col">
                    {dossierMap.conjoin ? dossierMap.conjoin.prenom_m_fr : null}
                  </td>
                </tr>
              ))
            : null}
        </tbody>
      </Table>
    </MainScreen>
  );
}

export default EnquetCNL;
