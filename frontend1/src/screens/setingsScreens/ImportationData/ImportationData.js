import React, { useEffect, useState } from "react";
import MainScreen from "../../../components/MainScreen/MainScreen";
import ErrorMessage from "../../../components/ErrorMessage";
import Message from "../../../components/Message";
import Loading from "../../../components/Loading";

import { sendImportationFichierAction } from "../../../actions/importationFichierActions";
// import { validateHeaderAction } from "../../../actions/validateHeaderActions";
import { downloadImportationFichierTemplateAction } from "../../../actions/templatesActions";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "react-bootstrap";
import fileDownload from "js-file-download";

function ImportationData() {
  // const validHeader = [
  //   "N°",
  //   "Type D N",
  //   "Nom",
  //   "Prenom",
  //   "N°\r\nDE ACT",
  //   "Date de naissance",
  //   "Lieu de naissance",
  //   "sexe",
  //   "Prénom du pére",
  //   "Nom de la mére",
  //   "Prenom de la mére",
  //   "S F ",
  //   "Ref demande",
  //   "Date demande",
  //   "Type D N C",
  //   "Nom DE CONJOINT",
  //   "Prenom DE CONJOINT",
  //   "Date de naissance",
  //   "N DE L ACT",
  //   "Lieu de naissance",
  //   "Prénom du pére",
  //   "Nom de la mére",
  //   "Prénom de la mére",
  //   "Remarque",
  // ];
  const [frFile, setFrFile] = useState(null);
  const [arFile, setArFile] = useState(null);
  const [creator, setCreator] = useState("");
  const [headerMessage, setHeaderMessage] = useState("");
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  // const fichierImported = useSelector((state) => state.importedFichier);
  // const { fichierInfo: imporFichierInfo } = fichierImported;

  useEffect(() => {
    setCreator(userInfo.username);
  }, [userInfo]);

  const downloadingTemplate = useSelector(
    (state) => state.importationFichierTemp
  );
  const {
    loading: downloadTemplateLoading,
    importationFichierTemp,
    success: downloadTemplateSuccess,
    error: downloadTemplateError,
  } = downloadingTemplate;

  const headerValidation = useSelector((state) => state.validateHeader);
  const {
    loading: headerValidationLoading,
    status: headerValidationStatus,
    success: headerValidationSuccess,
    error: headerValidationError,
  } = headerValidation;

  useEffect(() => {
    if (importationFichierTemp?.data) {
      fileDownload(
        importationFichierTemp.data,
        importationFichierTemp.headers["content-disposition"].slice(22, 53)
      );
    }
  }, [dispatch, importationFichierTemp, downloadTemplateSuccess]);

  const downloadTemplateAr = (event) => {
    if (creator)
      dispatch(downloadImportationFichierTemplateAction(creator, "Ar"));
  };

  const downloadTemplateFr = (event) => {
    if (creator)
      dispatch(downloadImportationFichierTemplateAction(creator, "Fr"));
  };

  const sendArFile = async (event) => {
    if (arFile) {
      dispatch(
        sendImportationFichierAction(arFile, creator, "Arabic Fichier Imported")
      );
    }
  };

  const sendFrFile = async (event) => {
    if (frFile) {
      dispatch(
        sendImportationFichierAction(frFile, creator, "French Fichier Imported")
      );
    }
  };

  useEffect(() => {
    if (headerValidationSuccess)
      if (headerValidationStatus)
        dispatch(
          sendImportationFichierAction(frFile, creator, "Fichier Imported")
        );
      else setHeaderMessage("الملف غير مناسب يرجى تحميل المثال");
  }, [
    headerValidationSuccess,
    headerValidationStatus,
    creator,
    dispatch,
    frFile,
  ]);

  useEffect(() => {
    if (headerValidationSuccess)
      if (headerValidationStatus)
        dispatch(
          sendImportationFichierAction(arFile, creator, "Fichier Imported")
        );
      else setHeaderMessage("الملف غير مناسب يرجى تحميل المثال");
  }, [
    headerValidationSuccess,
    headerValidationStatus,
    creator,
    dispatch,
    arFile,
  ]);

  const importedFichier = useSelector((state) => state.importedFichier);
  const { loading, fichierInfo, error } = importedFichier;

  // const headerCheckFR = (files) => {
  //   var validFile = false;
  //   var headerRow = false;
  // };

  const onChangeAr = (event) => {
    if (
      event.target.files[0].type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      event.target.files[0].type === "application/vnd.ms-excel"
    ) {
      setArFile(event.target.files[0]);
    }
  };

  const onChangeFr = (event) => {
    if (
      event.target.files[0].type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      event.target.files[0].type === "application/vnd.ms-excel"
    ) {
      setFrFile(event.target.files[0]);
    }
  };

  return (
    <>
      <div className="alerts">
        {downloadTemplateError && (
          <ErrorMessage variant="danger">{downloadTemplateError}</ErrorMessage>
        )}

        {downloadTemplateLoading && <Loading />}
        {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}

        {headerValidationLoading && <Loading />}
        {headerValidationError && (
          <ErrorMessage variant="danger">{headerValidationError}</ErrorMessage>
        )}
        {headerMessage && (
          <ErrorMessage variant="danger">{headerMessage}</ErrorMessage>
        )}

        {loading && <Loading />}

        {fichierInfo && (
          <Message variant="info">{`تم تحميل الملف "${fichierInfo}" بنجاح.`}</Message>
        )}
      </div>

      <MainScreen title={"رفع الملف من اجل اظافة او التحقيق"}>
        <div className="card mt-5">
          <div className="card-header d-flex flex-row-reverse">
            <b>اختار ملف جدول المعلومات</b>
          </div>
          <div className="card-body ">
            <div className="card-body ">
              <p class="card-text">
                تسمح الواجهه بتحميل ملف جدول المعلومات الذي يجب ملئه بمعلومات
                الملفات بالعربيه او الفرنسية كل منهما في ورقه على حده
              </p>
            </div>
          </div>
          <div className="card-header d-flex flex-row-reverse">
            <b>جدول المعلومات بالعربي</b>
          </div>
          <div className="card-body ">
            <div className="input-group mb-3">
              <input
                type="file"
                class="form-control"
                id="inputGroupFile01"
                aria-describedby="inputGroupFileAddon01"
                aria-label="Upload"
                onChange={onChangeAr}
              />
              <Button
                className=""
                id="inputGroupFileAddon01"
                onClick={sendArFile}
              >
                رفع ملف جدول المعلومات بالعربي
              </Button>
            </div>

            <Button className="m-2" onClick={downloadTemplateAr}>
              {"تحميل ملف جدول المعلومات بالعربي للملئ"}
            </Button>
          </div>
          <div className="card-header d-flex flex-row-reverse">
            <b>جدول المعلومات بالفرنسي</b>
          </div>
          <div className="card-body ">
            <div className="input-group mb-3">
              <input
                type="file"
                class="form-control"
                id="inputGroupFile02"
                aria-describedby="inputGroupFileAddon02"
                aria-label="Upload"
                onChange={onChangeFr}
              />
              <Button
                className=""
                id="inputGroupFileAddon02"
                onClick={sendFrFile}
              >
                رفع ملف جدول المعلومات بالفرنسي
              </Button>
              {/* <label className="custom-file-label" htmlFor="inputGroupFileAddon02">
              {fileName}
            </label> */}
            </div>

            <Button className="m-2" onClick={downloadTemplateFr}>
              {"تحميل ملف جدول المعلومات بالفرنسي للملئ"}
            </Button>
          </div>
        </div>
      </MainScreen>
    </>
  );
}

export default ImportationData;
