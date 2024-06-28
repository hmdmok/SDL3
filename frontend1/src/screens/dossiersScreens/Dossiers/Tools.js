import React from "react";
import { Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addList, deleteList } from "../../../actions/filesActions";
import { addBenefisierList } from "../../../actions/benifisierActions";
import styles from "./Tools.module.css";

const Tools = ({total, limit, data, page, setPage}) => {
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
    setPage(page + 1);
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
      {totalPages > 0 &&
        [...Array(totalPages).keys()].map((val, index) => (
          <button
            className={
              page === index + 1
                ? `${styles.page_btn} ${styles.active}`
                : `${styles.page_btn}`
            }
            key={index}
            onClick={() => clickPage(index)}
          >
            {index + 1}
          </button>
        ))}
    </div>
  );
};

export default Tools;
