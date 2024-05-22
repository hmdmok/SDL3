<<<<<<< HEAD
import React, { useEffect, useState } from "react";
import ErrorMessage from "../../../components/ErrorMessage";
import MainScreen from "../../../components/MainScreen/MainScreen";
import FileDownload from "js-file-download";
import { Accordion, Button, Card, Form } from "react-bootstrap";
// import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  listEnquetCNLsAction,
  getEnquetCNLAction,
  getEnquetCNASAction,
  getEnquetCASNOSAction,
} from "../../../actions/enquetCNLActions";
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
  const { loading, enquetCNLs: dossierEnq, error, success } = enquetCNLList;

  const getEnquetCNL = useSelector((state) => state.enquetCNLGet);
  const {
    loading: getEnquetCNLLoading,
    enquetCNLs: enqCNLFile,
    error: getEnquetCNLerror,
    success: getEnquetCNLSuccess,
  } = getEnquetCNL;

  const getEnquetCNAS = useSelector((state) => state.enquetCNASGet);
  const {
    loading: getEnquetCNASLoading,
    enquetCNASs: enqCNASFile,
    error: getEnquetCNASerror,
    success: getEnquetCNASSuccess,
  } = getEnquetCNAS;

  const getEnquetCASNOS = useSelector((state) => state.enquetCASNOSGet);
  const {
    loading: getEnquetCASNOSLoading,
    enquetCASNOSs: enqCASNOSFile,
    error: getEnquetCASNOSerror,
    success: getEnquetCASNOSSuccess,
  } = getEnquetCASNOS;

  const onUpload = () => {
    dispatch(listEnquetCNLsAction(form.fromDate, form.toDate));
  };

  const onGetEnqCNL = () => {
    dispatch(getEnquetCNLAction(listDossierEnquet));
  };

  const onGetEnqCNAS = () => {
    dispatch(getEnquetCNASAction(listDossierEnquet));
  };

  const onGetEnqCASNOS = () => {
    dispatch(getEnquetCASNOSAction(listDossierEnquet));
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

  useEffect(() => {
    if (getEnquetCNLSuccess) {
      FileDownload(enqCNLFile.data, "EnquetCNL.xlsx");
    }
  }, [dispatch, enqCNLFile, getEnquetCNLSuccess]);

  useEffect(() => {
    if (getEnquetCNASSuccess) {
      FileDownload(enqCNASFile.data, "EnquetCNAS.mdb");
    }
  }, [dispatch, enqCNASFile, getEnquetCNASSuccess]);

  useEffect(() => {
    if (getEnquetCASNOSSuccess) {
      FileDownload(enqCASNOSFile.data, "CASNOSENQ.dbf");
    }
  }, [dispatch, enqCASNOSFile, getEnquetCASNOSSuccess]);

  const handleSelect = (event, dossier) => {
    const value = dossier;
    const isChecked = event.target.checked;

    if (isChecked) {
      //Add checked item into checkList
      setListDossierEnquet([...listDossierEnquet, value]);
      console.log(listDossierEnquet);
    } else {
      //Remove unchecked item from checkList
      const filteredList = listDossierEnquet.filter(
        (item) => item.dossier._id !== value._id
      );
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
    <MainScreen title={"التحقيق"}>
      {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
      {loading && <Loading />}

      {getEnquetCNLerror && (
        <ErrorMessage variant="danger">{getEnquetCNLerror}</ErrorMessage>
      )}
      {getEnquetCNLLoading && <Loading />}

      {getEnquetCNASerror && (
        <ErrorMessage variant="danger">{getEnquetCNASerror}</ErrorMessage>
      )}
      {getEnquetCNASLoading && <Loading />}

      {getEnquetCASNOSerror && (
        <ErrorMessage variant="danger">{getEnquetCASNOSerror}</ErrorMessage>
      )}
      {getEnquetCASNOSLoading && <Loading />}

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

      {success ? (
        <>
          <h1 className="text-right">الرجاء تحديد الملفات للتحقيق</h1>
          <br />
          <Button className="btn btn-primary m-2" onClick={onGetEnqCNL}>
            Enquet CNL
          </Button>
          <Button className="btn btn-primary m-2" onClick={onGetEnqCNAS}>
            Enquet CNAS
          </Button>
          <Button className="btn btn-primary m-2" onClick={onGetEnqCASNOS}>
            Enquet CASNOS
          </Button>
        </>
      ) : null}
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
              >
                {`الملف رقم: ${dossierMap.dossier?.num_dos} `}
                <br />
                {`اسم طالب السكن: ${dossierMap.dossier?.demandeur[0]?.nom}
                ;  ${dossierMap.dossier?.demandeur[0]?.prenom}`}
                <br />
                {dossierMap.dossier?.conjoin[0]
                  ? `اسم الزوجة: ${dossierMap.dossier?.conjoin[0]?.nom}
                 ; ${dossierMap.dossier?.conjoin[0]?.prenom}`
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
                      <td>
                        {dossierMap.dossier?.stuation_s_avec_d ? "نعم" : "لا"}
                      </td>
                    </tr>
                    <tr>
                      <th scope="col">من ذوي الهمم</th>
                      <td>
                        {dossierMap.dossier?.stuation_s_andicap ? "نعم" : "لا"}
                      </td>
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
=======
import React from "react";
import MainScreen from "../../../components/MainScreen/MainScreen";
import { ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";

import SingleDossier from "../../dossiersScreens/Dossiers/SingleDossier";
import EnqTools from "./EnqTools";

function EnquetCNL() {
  const filesToCheck = useSelector((state) => state.filesToCheck);
  const { filesInfo } = filesToCheck;
  const { files } = filesInfo;

  return (
    <MainScreen title={"التحقيق"}>
      <ListGroup>
        {files?.map((dossierMap) => (
          <SingleDossier dossierMap={dossierMap} key={dossierMap._id} />
        ))}
      </ListGroup>
      <EnqTools />
>>>>>>> b7e9886259844540b0ba387106a452ce8a2545b2
    </MainScreen>
  );
}

export default EnquetCNL;
