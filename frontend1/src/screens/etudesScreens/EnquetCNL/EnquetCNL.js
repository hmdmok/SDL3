import React, { useEffect, useState } from "react";
import ErrorMessage from "../../../components/ErrorMessage";
import MainScreen from "../../../components/MainScreen/MainScreen";
import FileDownload from "js-file-download";
import { Accordion, Button, Card, Form, ListGroup } from "react-bootstrap";
// import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  listEnquetCNLsAction,
  getEnquetCNLAction,
  getEnquetCNASAction,
  getEnquetCASNOSAction,
} from "../../../actions/enquetCNLActions";
import Loading from "../../../components/Loading";
import SingleDossier from "../../dossiersScreens/Dossiers/SingleDossier";
import Filters from "../../dossiersScreens/Dossiers/Filters";
import EnqTools from "./EnqTools";

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

  const filesToCheck = useSelector((state) => state.filesToCheck);
  const { filesInfo } = filesToCheck;
  const { files } = filesInfo;

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
    <>
      <div className="allerts">
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
        {dateMessage && (
          <ErrorMessage variant="danger">{dateMessage}</ErrorMessage>
        )}
      </div>
      <MainScreen title={"التحقيق"}>
        <ListGroup>
          {files?.map((dossierMap) => (
            <SingleDossier dossierMap={dossierMap} key={dossierMap._id} />
          ))}
        </ListGroup>
        <EnqTools />
      </MainScreen>
    </>
  );
}

export default EnquetCNL;
