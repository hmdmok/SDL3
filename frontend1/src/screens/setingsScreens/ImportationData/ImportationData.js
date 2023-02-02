import React, { useEffect, useState } from "react";
import MainScreen from "../../../components/MainScreen/MainScreen";
import ErrorMessage from "../../../components/ErrorMessage";
import Message from "../../../components/Message";
import Loading from "../../../components/Loading";

import { sendImportationDataAction } from "../../../actions/importationDataActions";
import { useDispatch, useSelector } from "react-redux";

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
      dispatch(sendImportationDataAction(file, creator, "Data Imported"));
  }, [file]);

  const importedData = useSelector((state) => state.importedData);
  const { loading, imported, error } = importedData;

  // const headerCheckFR = (files) => {
  //   var validFile = false;
  //   var headerRow = false;
  // };

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
          <label>French File</label>
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
          {/* <label>Arab File</label>
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
          </div> */}

          <div>
            <h1 className="my-5">ملفات السجل</h1>
            {/* <Table striped bordered responsive id="data-table">
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
            </Table> */}
          </div>
        </div>
      </div>
    </MainScreen>
  );
}

export default ImportationData;
