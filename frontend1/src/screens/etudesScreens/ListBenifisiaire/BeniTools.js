import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteBenefisierList } from "../../../actions/benifisierActions";
import { listBenefisiersAction } from "../../../actions/listBenefisiersActions";
import fileDownload from "js-file-download";
import { Badge, Button } from "react-bootstrap";
import ErrorMessage from "../../../components/ErrorMessage";
import Loading from "../../../components/Loading";

const BeniTools = () => {
  const dispatch = useDispatch();

  const filesToBenifits = useSelector((state) => state.filesToBenifits);
  const { benefisiersInfo } = filesToBenifits;
  const { benefisiers } = benefisiersInfo;

  const listBenefisiersGet = useSelector((state) => state.listBenefisiersGet);
  const { loading, listBenefisiers, error, success } = listBenefisiersGet;

  const dellAllDossiersFromBenefisiers = () => {
    dispatch(deleteBenefisierList());
  };

  const onGetBenefisiersList = (listDossierBenefisiers, type) => {
    dispatch(listBenefisiersAction(listDossierBenefisiers, type));
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
    <div className="tools">
      <h4> اعدادات ملفات المستفيدين</h4>

      <Badge>{`يوجد ${benefisiers?.length.toString()}  ملف للاستفادة`}</Badge>

      <hr />
      <Button
        variant="success"
        className="m-1 "
        onClick={() => {
          onGetBenefisiersList(benefisiers, "p");
        }}
      >
        انشاء ملف المستفيدين اكبر من 35 بالفرنسية
      </Button>

      <Button
        variant="success"
        className="m-1 "
        onClick={() => {
          onGetBenefisiersList(benefisiers, "m");
        }}
      >
        انشاء ملف المستفيدين اقل من 35 بالفرنسية
      </Button>
      <Button
        variant="success"
        className="m-1 "
        onClick={() => {
          onGetBenefisiersList(benefisiers, "p");
        }}
      >
        انشاء ملف المستفيدين اكبر من 35
      </Button>

      <Button
        variant="success"
        className="m-1 "
        onClick={() => {
          onGetBenefisiersList(benefisiers, "m");
        }}
      >
        انشاء ملف المستفيدين اقل من 35
      </Button>
      <Button
        variant="danger"
        className="m-1 "
        onClick={() => {
          dellAllDossiersFromBenefisiers();
        }}
      >
        حذف كل القائمة
      </Button>
      <div className="alerts">
        {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
        {loading && <Loading />}
      </div>
    </div>
  );
};

export default BeniTools;
