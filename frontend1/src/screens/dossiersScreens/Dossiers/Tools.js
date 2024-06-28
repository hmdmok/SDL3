import React from "react";
import { Badge, Button, ButtonGroup, ButtonToolbar } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addList, deleteList } from "../../../actions/filesActions";
import { addBenefisierList } from "../../../actions/benifisierActions";
import styles from "./Tools.module.css";

const Tools = ({ total, limit, data, page, setPage }) => {
  const dispatch = useDispatch();

  const addListToCheck = (fileTo) => {
    dispatch(addList(fileTo));
  };

  const dellAllDossiersFromCheck = () => {
    dispatch(deleteList());
  };

  const addListToBenefisiers = (fileTo) => {
    dispatch(addBenefisierList(fileTo));
  };
  const totalPages = Math.ceil(total / limit);

  const clickPage = (page) => {
    setPage(page);
  };
  return (
    <div style={{ display: "flex", flexDirection: "row-reverse" }} className="">
      <Button className="m-1 ">
        <Link to="/demandeur">اضافة ملف جديد</Link>
      </Button>

      <Button
        variant="success"
        className="m-1 "
        onClick={() => {
          addListToCheck(data);
        }}
      >
        اظافة كل القائمة للتحقيق
      </Button>
      <Button
        variant="danger"
        className="m-1 "
        onClick={() => {
          dellAllDossiersFromCheck();
        }}
      >
        حذف كل القائمة من التحقيق
      </Button>

      <Button
        variant="success"
        className="m-1"
        onClick={() => {
          addListToBenefisiers(data);
        }}
      >
        اظافة كل القائمة للمسفيدين
      </Button>
      <Button
        variant="danger"
        className="m-1"
        onClick={() => {
          dellAllDossiersFromCheck();
        }}
      >
        حذف كل القائمة من المستفيدين
      </Button>

      <Button className="m-1 ">
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
            {/* {[...Array(totalPages).keys()].map((val, index) => (
              <Button
                className={page === index + 1 ? ` ${styles.active}` : ``}
                key={index}
                onClick={() => clickPage(index)}
              >
                {index + 1}
              </Button>
            ))} */}
          </ButtonGroup>
          <ButtonGroup
            style={{ display: "flex" }}
            className="me-2"
            aria-label="First group"
          >
            <Button >عدد الصفحات : {totalPages}</Button>
          </ButtonGroup>
        </ButtonToolbar>
      )}
    </div>
  );
};

export default Tools;
