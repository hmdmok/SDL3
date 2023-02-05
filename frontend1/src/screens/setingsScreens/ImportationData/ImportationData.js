import React, { useEffect, useState } from "react";
import MainScreen from "../../../components/MainScreen/MainScreen";
import ErrorMessage from "../../../components/ErrorMessage";
import Message from "../../../components/Message";
import Loading from "../../../components/Loading";

import { sendImportationDataAction } from "../../../actions/importationDataActions";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import axios from "axios";

function ImportationData() {
  const [fileName, setFileName] = useState(null);
  const [file, setFile] = useState(null);
  const [creator, setCreator] = useState("");

  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    setCreator(userInfo.username);
  }, [userInfo]);

  useEffect(() => {
    if (file)
      dispatch(
        sendImportationDataAction(file, creator, fileName, "Data Imported")
      );
  }, [file, creator, dispatch]);

  const importedData = useSelector((state) => state.importedData);
  const { loading, imported, error } = importedData;

  // const headerCheckFR = (files) => {
  //   var validFile = false;
  //   var headerRow = false;
  // };
  const correctionDB = (event) => {
    //send request to correct DB
  };
  const updateDB = async (event) => {
    //send request to correct DB

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post("/api/importationData/update", "formData", config);
    } catch (error) {
      console.log(error);
    }
  };

  const updateDBfr = async (event) => {
    //send request to correct DB

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post("/api/importationData/updateFr", "formData", config);
    } catch (error) {
      console.log(error);
    }
  };

  const enquetCASNOS = async (event) => {
    //send request to correct DB

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post("/api/importationData/updateFr", "formData", config);
    } catch (error) {
      console.log(error);
    }
  };

  const enquetCNAS = async (event) => {
    //send request to correct DB

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post("/api/importationData/updateFr", "formData", config);
    } catch (error) {
      console.log(error);
    }
  };

  const enquetCNL = async (event) => {
    //send request to correct DB

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      await axios.post("/api/importationData/updateFr", "formData", config);
    } catch (error) {
      console.log(error);
    }
  };


  const onChange = (event) => {
    if (
      event.target.files[0].type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      event.target.files[0].type === "application/vnd.ms-excel"
    ) {
      setFileName(event.target.files[0].name);
      setFile(event.target.files[0]);
    }
  };
  return (
    <MainScreen title={"Importation des tables"}>
      {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
      {imported && <Message variant="info">{imported}</Message>}
      {loading && <Loading />}
      <div className="card my-5">
        <div className="card-header">
          <b>اختار ملف</b>
        </div>

        <div className="card-body">
          <label>Importation File to Upload</label>
          <div className="custom-file">
            <input
              type="file"
              className="custom-file-input"
              id="customFileLang"
              onChange={onChange}
            />
            <label className="custom-file-label" htmlFor="customFileLang">
              {fileName}
            </label>
          </div>
          <div>
            <Button onClick={updateDBfr}>Ajout dossiers francais</Button>
            <Button onClick={updateDB}>Mise a Jour dossiers arab</Button>
            <Button onClick={correctionDB}>Correction DB</Button>
          </div>
          <div>
            <Button onClick={enquetCNL}>Enquet CNL</Button>
            <Button onClick={enquetCNAS}>Enquet CNnas</Button>
            <Button onClick={enquetCASNOS}>Enquet CASNOS</Button>
          </div>
        </div>
      </div>
    </MainScreen>
  );
}

export default ImportationData;
