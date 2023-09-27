import React from "react";
import { Badge, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addList, deleteList } from "../../../actions/filesActions";
import { addBenefisierList } from "../../../actions/benifisierActions";

const Tools = () => {
  const dispatch = useDispatch();

  const dossierList = useSelector((state) => state.dossierList);
  const { dossiers } = dossierList;

  const addListToCheck = (fileTo) => {
    dispatch(addList(fileTo));
  };

  const dellAllDossiersFromCheck = () => {
    dispatch(deleteList());
  };

  const addListToBenefisiers = (fileTo) => {
    dispatch(addBenefisierList(fileTo));
  };

  return (
    <div className="tools">
      <h4> اعدادات عامة</h4>
      <hr />

      <Button className="m-1 ">
        <Link to="/demandeur">اضافة ملف جديد</Link>
      </Button>

      <Button
        variant="success"
        className="m-1 "
        onClick={() => {
          addListToCheck(dossiers);
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
          addListToBenefisiers(dossiers);
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
        <Badge>{dossiers?.length}</Badge>
      </Button>
    </div>
  );
};

export default Tools;
