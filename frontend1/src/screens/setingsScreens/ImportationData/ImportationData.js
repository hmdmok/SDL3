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
<<<<<<< HEAD
  return (
    <MainScreen title={"ImportationData"}>
      {/* <div className="card my-5">
        <div className="card-header">
          <b>اختار ملف</b>
        </div>
        {message ? (
          <div>
            <Message msg={message} />
            <ReactHTMLTableToExcel
              id="test-table-xls-button"
              className="download-table-xls-button  btn btn-primary mb-3"
              table="data-table"
              filename="tamplate"
              sheet="data"
              buttonText="تحميل المثال"
            />
          </div>
        ) : null}
        <div className="card-body">
=======
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
  const [fileName, setFileName] = useState(null);
  const [file, setFile] = useState(null);
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

  const downloadTemplate = (event) => {
    if (creator) dispatch(downloadImportationFichierTemplateAction(creator));
  };

  const sendFile = async (event) => {
    if (file) {
      dispatch(sendImportationFichierAction(file, creator, "Fichier Imported"));
    }
  };
  useEffect(() => {
    if (headerValidationSuccess)
      if (headerValidationStatus)
        dispatch(
          sendImportationFichierAction(file, creator, "Fichier Imported")
        );
      else setHeaderMessage("الملف غير مناسب يرجى تحميل المثال");
  }, [
    headerValidationSuccess,
    headerValidationStatus,
    creator,
    dispatch,
    file,
  ]);

  const importedFichier = useSelector((state) => state.importedFichier);
  const { loading, fichierInfo, error } = importedFichier;

  // const headerCheckFR = (files) => {
  //   var validFile = false;
  //   var headerRow = false;
  // };
  const correctionDB = (event) => {
    //send request to correct DB
  };

  const updateDB = async (event) => {
    //send request to correct DB
  };

  const updateDBfr = async (event) => {
    //send request to correct DB
  };

  const enquetCASNOS = async (event) => {
    //send request to correct DB
  };

  const enquetCNAS = async (event) => {
    //send request to correct DB
  };

  const enquetCNL = async (event) => {
    //send request to correct DB
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
    <MainScreen title={"رفع الملف من اجل اظافة او التحقيق"}>
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
      <div className="card mt-5">
        <div className="card-header d-flex flex-row-reverse">
          <b>اختار ملف</b>
        </div>

        <div className="card-body ">
>>>>>>> b7e9886259844540b0ba387106a452ce8a2545b2
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
<<<<<<< HEAD
          </div>

          <div>
            {messageTable ? (
              <div>
                <Message msg={messageTable} />
                <h1 className="my-5">جدول الاخطاء</h1>
                <Table striped bordered responsive id="error-table">
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col">السطر</th>
                      <th scope="col">البلدية</th>
                      <th scope="col">رقم السجل</th>
                      <th scope="col">رقم الملف</th>
                      <th scope="col">تاريخ ايداع الملف</th>
                      <th scope="col">الاسم</th>
                      <th scope="col">اللقب</th>
                      <th scope="col">تاريخ الميلاد</th>
                      <th scope="col">مكان الميلاد</th>
                      <th scope="col">العنوان</th>
                      <th scope="col">اسم الاب</th>
                      <th scope="col">لقب الام</th>
                      <th scope="col">اسم الام</th>
                      <th scope="col">حالة الملف</th>
                      <th scope="col">رقم الحصة</th>
                      <th scope="col">تاريخ الاستفادة</th>
                      <th scope="col">ملاحضات</th>
                    </tr>
                  </thead>
                  {tableErrors.length !== 0 ? (
                    <tbody>
                      {tableErrors.map((rowMap1, x) => (
                        <tr className={x} key={x + 1234}>
                          {rowMap1.map(
                            (cell, i) => (
                              <td className={i} key={cell + i}>
                                {cell}
                              </td>
                            )
                            // <option key={wilaya.id} value={wilaya.code} >{wilaya.nom_wilaya}</option>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  ) : null}
                </Table>
              </div>
            ) : null}

            <h1 className="my-5">ملفات السجل</h1>
            {tableOutput.length !== 0 ? (
              <div>
                <button>اظافة الملفات الى قاعدة البيانات</button>
              </div>
            ) : null}
            <Table striped bordered responsive id="data-table">
              <thead className="thead-dark">
                <tr>
                  <th scope="col">السطر</th>
                  <th scope="col">البلدية</th>
                  <th scope="col">رقم السجل</th>
                  <th scope="col">رقم الملف</th>
                  <th scope="col">تاريخ ايداع الملف</th>
                  <th scope="col">الاسم</th>
                  <th scope="col">اللقب</th>
                  <th scope="col">تاريخ الميلاد</th>
                  <th scope="col">مكان الميلاد</th>
                  <th scope="col">العنوان</th>
                  <th scope="col">اسم الاب</th>
                  <th scope="col">لقب الام</th>
                  <th scope="col">اسم الام</th>
                  <th scope="col">حالة الملف</th>
                  <th scope="col">رقم الحصة</th>
                  <th scope="col">تاريخ الاستفادة</th>
                  <th scope="col">ملاحضات</th>
                </tr>
              </thead>
              {tableOutput.length !== 0 ? (
                <tbody>
                  {tableOutput.map((rowMap, x) => (
                    <tr className={x} key={x}>
                      {rowMap.map(
                        (cell, i) => (
                          <td className={i} key={cell + i}>
                            {cell}
                          </td>
                        )
                        // <option key={wilaya.id} value={wilaya.code} >{wilaya.nom_wilaya}</option>
                      )}
                    </tr>
                  ))}
                </tbody>
              ) : null}
            </Table>
          </div>
        </div>
      </div> */}
=======
            <div className="card-body d-flex flex-row-reverse">
              <Button className="m-2" onClick={sendFile}>
                رفع الملف
              </Button>
              <Button className="m-2" onClick={downloadTemplate}>
                تحميل المثال للملئ
              </Button>
            </div>
          </div>
        </div>
        <div className="card mt-3">
          <div className="card-header d-flex flex-row-reverse">
            <b>اختار العملية</b>
          </div>
          <div className="card-body d-flex flex-row-reverse">
            <Button className="m-2" onClick={updateDBfr}>
              Ajout dossiers francais
            </Button>
            <Button className="m-2" onClick={updateDB}>
              Mise a Jour dossiers arab
            </Button>
            <Button className="m-2" onClick={correctionDB}>
              Correction DB
            </Button>
          </div>
          <div className="card-body d-flex flex-row-reverse">
            <Button className="m-2" onClick={enquetCNL}>
              Enquet CNL
            </Button>
            <Button className="m-2" onClick={enquetCNAS}>
              Enquet CNnas
            </Button>
            <Button className="m-2" onClick={enquetCASNOS}>
              Enquet CASNOS
            </Button>
          </div>
        </div>
      </div>
>>>>>>> b7e9886259844540b0ba387106a452ce8a2545b2
    </MainScreen>
  );
}

export default ImportationData;
