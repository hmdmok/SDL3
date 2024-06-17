import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { deleteBenefisierList } from "../../../actions/benifisierActions";
import { listBenefisiersAction } from "../../../actions/listBenefisiersActions";
import fileDownload from "js-file-download";
import { Badge, Button, Dropdown, DropdownButton } from "react-bootstrap";
import ErrorMessage from "../../../components/ErrorMessage";
import Loading from "../../../components/Loading";
import { listQuotas } from "../../../actions/quotaActions";
import { checkSystem, updateSystem } from "../../../actions/systemActions";
import { useState } from "react";

const BeniTools = () => {
  const dispatch = useDispatch();

  const filesToBenifits = useSelector((state) => state.filesToBenifits);
  const { benefisiersInfo } = filesToBenifits;
  const { benefisiers } = benefisiersInfo;

  const listQuotasGet = useSelector((state) => state.quotaList);
  const { loading: loadingQuotas, quotas, error: errorQuotas } = listQuotasGet;

  const listBenefisiersGet = useSelector((state) => state.listBenefisiersGet);
  const { loading, listBenefisiers, error, success } = listBenefisiersGet;

  const dellAllDossiersFromBenefisiers = () => {
    dispatch(deleteBenefisierList());
  };

  const onGetBenefisiersList = (listDossierBenefisiers, type) => {
    dispatch(
      listBenefisiersAction(
        listDossierBenefisiers,
        type,
        systemInfo[0].quotaDate
      )
    );
  };

  useEffect(() => {
    if (success) {
      fileDownload(
        listBenefisiers.data,
        listBenefisiers.headers["content-disposition"]?.split('"')[1]
      );
    }
  }, [dispatch, listBenefisiers, success]);

  useEffect(() => {
    dispatch(listQuotas());
  }, [dispatch]);

  useEffect(() => {
    dispatch(checkSystem());
  }, [dispatch]);

  const systemData = localStorage.getItem("systemInfo");
  const systemInfo = JSON.parse(systemData);

  const [title, setTitle] = useState(systemInfo[0]?.quotaTitle);

  useEffect(() => {
    setTitle(systemInfo[0]?.quotaTitle);
  }, [systemInfo]);
  return (
    <div className="tools">
      <h4> اعدادات ملفات المستفيدين</h4>

      <Badge>{`يوجد ${benefisiers?.length.toString()}  ملف للاستفادة`}</Badge>

      <hr />
      <DropdownButton
        id="dropdown-basic-button"
        variant="info"
        className="flex m-1 "
        title={title}
      >
        {quotas?.map((quota) => (
          <Dropdown.Item
            key={quota._id}
            onClick={() => {
              dispatch(
                updateSystem(
                  systemInfo[0]._id,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  null,
                  quota.quotadate,
                  quota.quotanameFr,
                  quota.quotaquant,
                  null,
                  null,
                  null
                )
              );
              dispatch(checkSystem());
            }}
          >
            {quota.quotaname}
          </Dropdown.Item>
        ))}
      </DropdownButton>
      <Button
        variant="success"
        className="m-1 "
        onClick={() => {
          onGetBenefisiersList(benefisiers, "french",systemInfo[0].quotaDate);
        }}
      >
        انشاء ملف المستفيدين بالفرنسية
      </Button>

      <Button
        variant="success"
        className="m-1 "
        onClick={() => {
          onGetBenefisiersList(benefisiers, "frenchr");
        }}
      >
        انشاء ملف الاحتياطيين بالفرنسية
      </Button>

      <Button
        variant="success"
        className="m-1 "
        onClick={() => {
          onGetBenefisiersList(benefisiers, "arabic");
        }}
      >
        انشاء ملف المستفيدين
      </Button>

      <Button
        variant="success"
        className="m-1 "
        onClick={() => {
          onGetBenefisiersList(benefisiers, "arabicr");
        }}
      >
        انشاء ملف الاحتياطيين
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
        {errorQuotas && (
          <ErrorMessage variant="danger">{errorQuotas}</ErrorMessage>
        )}
        {loadingQuotas && <Loading />}
      </div>
    </div>
  );
};

export default BeniTools;
