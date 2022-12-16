import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import MainScreen from "../../../components/MainScreen/MainScreen";
import ErrorMessage from "../../../components/ErrorMessage";
import Loading from "../../../components/Loading";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { read, utils } from "xlsx";

function ImportationData() {
  const [fileName, setFileName] = useState(null);
  const [tableOutput, setTableOutput] = useState([]);
  const [tableErrors, setTableErrors] = useState([]);
  const [messageTable, setMessageTable] = useState("");
  const [message, setMessage] = useState("");

  const onChange = (event) => {};
  return (
    <MainScreen title={"Importation des tables"}>
      <div className="card my-5">
        <div className="card-header">
          <b>اختار ملف</b>
        </div>
        {message ? (
          <div>
            {message && (
              <ErrorMessage variant="danger">{message} </ErrorMessage>
            )}
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
            {messageTable ? (
              <div>
                {messageTable && (
                  <ErrorMessage variant="danger">{messageTable} </ErrorMessage>
                )}
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
      </div>
    </MainScreen>
  );
}

export default ImportationData;
