import React, { useEffect, useState } from "react";
import MainScreen from "../../../components/MainScreen/MainScreen";
import ErrorMessage from "../../../components/ErrorMessage";
import Message from "../../../components/Message";
import Loading from "../../../components/Loading";

import {
  sendImportationFichierAction,
  fixingDBAction,
} from "../../../actions/importationFichierActions";
// import { validateHeaderAction } from "../../../actions/validateHeaderActions";
import { downloadImportationFichierTemplateAction } from "../../../actions/templatesActions";
import { useDispatch, useSelector } from "react-redux";
import { Button, Form, Row, Col, InputGroup } from "react-bootstrap";
import fileDownload from "js-file-download";
import { addList, deleteList } from "../../../actions/filesActions";
import {
  addBenefisierList,
  deleteBenefisierList,
} from "../../../actions/benifisierActions";

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
  const [numDos, setNumDos] = useState(null);
  const [numDosIds, setNumDosIds] = useState([]);

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
        importationFichierTemp.headers["content-disposition"]?.split('"')[1]
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

  const sendNumDos = async (event) => {
    if (numDos) {
      dispatch(
        sendImportationFichierAction(numDos, creator, "numDos Fichier Imported")
      );
    }
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
  const addListToCheck = (fileTo) => {
    dispatch(addList(fileTo));
  };
  const dellAllDossiersFromCheck = () => {
    dispatch(deleteList());
  };

  const addListToBenefisiers = (fileTo) => {
    dispatch(addBenefisierList(fileTo));
  };
  const dellAllDossiersFromBenefisiers = () => {
    dispatch(deleteBenefisierList());
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
  useEffect(() => {
    console.log("fichierInfo: ", fichierInfo);
    if (!fichierInfo?.includes("dossiers")) setNumDosIds(fichierInfo);
  }, [fichierInfo]);

  const filename = (file) => {
    if (!file) return "لم يتم اختيار ملف";
    return file.name || String(file);
  };

  const onChangeAr = (event) => {
    if (
      event.target.files[0].type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      event.target.files[0].type === "application/vnd.ms-excel"
    ) {
      setArFile(event.target.files[0]);
    }
  };
  const onChangeNumDos = (event) => {
    if (
      event.target.files[0].type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" ||
      event.target.files[0].type === "application/vnd.ms-excel"
    ) {
      setNumDos(event.target.files[0]);
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
        {error && console.log("Error: ", importedFichier)}
        {headerValidationLoading && <Loading />}
        {headerValidationError && (
          <ErrorMessage variant="danger">{headerValidationError}</ErrorMessage>
        )}
        {headerMessage && (
          <ErrorMessage variant="danger">{headerMessage}</ErrorMessage>
        )}

        {loading && <Loading />}

        {fichierInfo?.includes("dossiers") && (
          <Message variant="info">{`تم تحميل الملف "${fichierInfo}" بنجاح.`}</Message>
        )}
        {numDosIds && <Message variant="info">{numDosIds}</Message>}
      </div>

      <MainScreen title={"رفع الملف من اجل اظافة او التحقيق"}>
        <div
          className="card mt-5 text-end"
          dir="rtl"
          style={{ direction: "rtl" }}
        >
          <div className="card-header d-flex align-items-center">
            <div>
              <b>رفع جدول المعلومات</b>
              <div className="text-muted small">
                قم برفع الملف بصيغة Excel (xlsx)
              </div>
            </div>
          </div>
          <div className="card-body">
            <p className="card-text">
              تسمح الواجهه بتحميل ملف جدول المعلومات الذي يجب ملئه بمعلومات
              الملفات بالعربيه او الفرنسية كل منهما في ورقه على حده
            </p>
            <Row className="mt-3">
              <Col md={6} className="mb-3">
                <div className="border rounded p-3">
                  <h6 className="mb-2">جدول المعلومات بالعربي</h6>
                  <InputGroup>
                    <Form.Control
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={onChangeAr}
                    />
                    <Button
                      variant="primary"
                      onClick={sendArFile}
                      disabled={!arFile}
                      className="ms-2 rounded-pill px-4"
                    >
                      رفع الملف
                    </Button>
                  </InputGroup>
                  <div className="mt-2 text-truncate">{filename(arFile)}</div>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="mt-2"
                    onClick={downloadTemplateAr}
                  >
                    تحميل مثال (عربي)
                  </Button>
                </div>
              </Col>
              <Col md={6} className="mb-3">
                <div className="border rounded p-3">
                  <h6 className="mb-2">جدول المعلومات بالفرنسي</h6>
                  <InputGroup>
                    <Form.Control
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={onChangeFr}
                    />
                    <Button
                      variant="primary"
                      onClick={sendFrFile}
                      disabled={!frFile}
                      className="ms-2 rounded-pill px-4"
                    >
                      رفع الملف
                    </Button>
                  </InputGroup>
                  <div className="mt-2 text-truncate">{filename(frFile)}</div>
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="mt-2"
                    onClick={downloadTemplateFr}
                  >
                    تحميل مثال (فرنسي)
                  </Button>
                </div>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col md={6} className="mb-3">
                <div className="border rounded p-3">
                  <h6 className="mb-2">قوائم المستفدين</h6>
                  <InputGroup>
                    <Form.Control
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={onChangeNumDos}
                    />
                    <Button
                      variant="primary"
                      onClick={sendNumDos}
                      disabled={!numDos}
                      className="ms-2 rounded-pill px-4"
                    >
                      رفع الملف
                    </Button>
                  </InputGroup>
                  <div className="mt-2 text-truncate">{filename(numDos)}</div>
                  <div className="mt-3">
                    <Button
                      variant="warning"
                      onClick={() =>
                        dispatch(fixingDBAction(creator, "fixing Data Base"))
                      }
                    >
                      اصلاح قاعدة البيانات
                    </Button>
                  </div>
                  {numDosIds?.length > 0 && (
                    <div className="mt-3">
                      <Button
                        variant="success"
                        size="sm"
                        className="me-2"
                        onClick={() => addListToCheck(numDosIds)}
                      >
                        اضافة الملفات للتحقيق ({numDosIds.length})
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        className="me-2"
                        onClick={dellAllDossiersFromCheck}
                      >
                        حذف كل قائمة التحقيق
                      </Button>
                      <Button
                        variant="success"
                        size="sm"
                        className="me-2"
                        onClick={() => addListToBenefisiers(numDosIds)}
                      >
                        اضافة الملفات للمسفيدين
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={dellAllDossiersFromBenefisiers}
                      >
                        حذف كل قائمة المستفيدين
                      </Button>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </MainScreen>
    </>
  );
}

export default ImportationData;
