import React, { useEffect } from "react";
import { Badge, Button, ButtonGroup, ButtonToolbar } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addList, deleteList } from "../../../actions/filesActions";
import {
  addBenefisierList,
  deleteBenefisierList,
} from "../../../actions/benifisierActions";
import styles from "./Tools.module.css";
import { getIDList } from "../../../Functions/functions";
import { listBenefisiersAction } from "../../../actions/listBenefisiersActions";
import Loading from "../../../components/Loading";
import ErrorMessage from "../../../components/ErrorMessage";
import fileDownload from "js-file-download";

const Tools = ({ total, limit, data, page, setPage, totalArray }) => {
  const dispatch = useDispatch();
  const addListToCheck = (fileTo) => {
    dispatch(addList(fileTo));
  };
  const listBenefisiersGet = useSelector((state) => state.listBenefisiersGet);
  const { loading, listBenefisiers, error, success } = listBenefisiersGet;

  const dellAllDossiersFromCheck = () => {
    dispatch(deleteList());
  };

  const addListToBenefisiers = (fileTo) => {
    dispatch(addBenefisierList(fileTo));
  };
  const dellAllDossiersFromBenefisiers = () => {
    dispatch(deleteBenefisierList());
  };
  const totalPages = Math.ceil(total / limit);

  const clickPage = (page) => {
    setPage(page);
  };
  const onGetBenefisiersList = (listDossierBenefisiers, type) => {
    dispatch(listBenefisiersAction(listDossierBenefisiers, type, "date-depo"));
  };

  useEffect(() => {
    if (success) {
      fileDownload(
        listBenefisiers.data,
        listBenefisiers.headers["content-disposition"]?.split('"')[1]
      );
    }
  }, [dispatch, listBenefisiers, success]);

  return (
    <div style={{ display: "flex", flexDirection: "row-reverse" }} className="">
      <Button
        variant="success"
        className="m-1 "
        size="sm"
        onClick={() => {
          addListToCheck(data);
        }}
      >
        اضافة كل الصفحة للتحقيق
      </Button>
      <Button
        variant="success"
        className="m-1 "
        size="sm"
        onClick={() => {
          addListToCheck(totalArray);
        }}
      >
        اضافة كل الملفات للتحقيق
      </Button>
      <Button
        variant="danger"
        className="m-1 "
        size="sm"
        onClick={() => {
          dellAllDossiersFromCheck();
        }}
      >
        حذف كل قائمة التحقيق
      </Button>

      <Button
        variant="success"
        className="m-1"
        size="sm"
        onClick={() => {
          addListToBenefisiers(data);
        }}
      >
        اضافة كل الصفحة للمسفيدين
      </Button>
      <Button
        variant="success"
        className="m-1"
        size="sm"
        onClick={() => {
          addListToBenefisiers(totalArray);
        }}
      >
        اضافة كل الملفات للمسفيدين
      </Button>
      <Button
        variant="danger"
        className="m-1"
        size="sm"
        onClick={() => {
          dellAllDossiersFromBenefisiers();
        }}
      >
        حذف كل قائمة المستفيدين
      </Button>
      <Button
        variant="warning"
        className="m-1"
        size="sm"
        onClick={() => {
          onGetBenefisiersList(getIDList(totalArray), "exportFilter");
        }}
      >
        excell 1
      </Button>
      <Button
        variant="warning"
        className="m-1"
        size="sm"
        onClick={() => {
          onGetBenefisiersList(getIDList(totalArray), "export");
        }}
      >
        excell 2
      </Button>

      <Button className="m-1 " size="sm">
        <Badge>ملف</Badge>
        <Badge>{total}</Badge>
      </Button>
      {totalPages > 0 && (
        <ButtonToolbar aria-label="Toolbar with button groups">
          <ButtonGroup
            style={{ display: "flex" }}
            className="me-2"
            aria-label="First group"
          >
            {page < totalPages && (
              <Button key={"lastPage"} onClick={() => clickPage(totalPages)}>
                {"اخر صفحة"}
              </Button>
            )}
            {page < totalPages && (
              <Button key={page + 1} onClick={() => clickPage(page + 1)}>
                {page + 1}
              </Button>
            )}
            <Button className={styles.active}>{page}</Button>
            {page > 1 && (
              <Button key={page - 1} onClick={() => clickPage(page - 1)}>
                {page - 1}
              </Button>
            )}
            {page > 1 && (
              <Button key={"firstPage"} onClick={() => clickPage(1)}>
                {"اول صفحة"}
              </Button>
            )}
          </ButtonGroup>
          <ButtonGroup
            style={{ display: "flex" }}
            className="me-2"
            aria-label="First group"
          >
            <Button>عدد الصفحات : {totalPages}</Button>
          </ButtonGroup>
        </ButtonToolbar>
      )}
      <div className="alerts">
        {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
        {loading && <Loading />}
      </div>
    </div>
  );
};

export default Tools;
