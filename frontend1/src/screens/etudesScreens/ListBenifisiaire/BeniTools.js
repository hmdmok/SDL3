import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import fileDownload from "js-file-download";
import { Badge, Button, Dropdown, DropdownButton } from "react-bootstrap";
import { deleteBenefisierList } from "../../../actions/benifisierActions";
import { listBenefisiersAction } from "../../../actions/listBenefisiersActions";
import { listQuotas } from "../../../actions/quotaActions";
import { checkSystem, updateSystem } from "../../../actions/systemActions";
import ErrorMessage from "../../../components/ErrorMessage";
import Loading from "../../../components/Loading";
import RadioGroup from "../../../Functions/RadioGroup";

const BeniTools = () => {
  const dispatch = useDispatch();
  const [systemInfo, setSystemInfo] = useState([]);
  const filesToBenifits = useSelector((state) => state.filesToBenifits);
  const { benefisiersInfo } = filesToBenifits;
  const { benefisiers } = benefisiersInfo;

  const listQuotasGet = useSelector((state) => state.quotaList);
  const { loading: loadingQuotas, quotas, error: errorQuotas } = listQuotasGet;

  const listBenefisiersGet = useSelector((state) => state.listBenefisiersGet);
  const { loading, listBenefisiers, error, success } = listBenefisiersGet;

  const [TriDossiers, setTriDossiers] = useState("date-depo");
  const [PhotoFemme, setPhotoFemme] = useState("true");
  const TriDossiersRadioItems = [
    { value: "date-depo", label: `تصنيف الملفات من تاريخ الايداع` },
    { value: "quotas", label: `تصنيف الملفات من تاريخ الحصة` },
  ];
  const PhotoFemmeRadioItems = [
    { value: "true", label: `اخفاء صور النساء` },
    { value: "false", label: `اضهار صور النساء` },
  ];

  const dellAllDossiersFromBenefisiers = () => {
    dispatch(deleteBenefisierList());
  };

  const onGetBenefisiersList = (
    listDossierBenefisiers,
    type,
    triDossiers,
    photoFemme
  ) => {
    if (systemInfo.length > 0) {
      dispatch(
        listBenefisiersAction(
          listDossierBenefisiers,
          type,
          triDossiers,
          photoFemme
        )
      );
    }
  };

  useEffect(() => {
    if (success && listBenefisiers) {
      try {
        fileDownload(
          listBenefisiers.data,
          listBenefisiers.headers["content-disposition"]?.split('"')[1]
        );
      } catch (error) {
        console.error("File download failed: ", error);
      }
    }
  }, [listBenefisiers, success]);

  useEffect(() => {
    dispatch(checkSystem());
    setSystemInfo(JSON.parse(localStorage.getItem("systemInfo")));
  }, [dispatch]);
  useEffect(() => {
    dispatch(listQuotas());
  }, [dispatch]);

  const [title, setTitle] = useState("لا يوجد حصة");
  const setQuotas = (quota) => {
    if (systemInfo.length > 0) {
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
      setTitle(quota.quotanameFr);
    }
  };

  useEffect(() => {
    if (systemInfo.length > 0 && systemInfo[0]?.quotaTitle) {
      setTitle(systemInfo[0].quotaTitle);
    } else {
      setTitle("لا يوجد حصة");
    }
  }, [systemInfo]);

  return (
    <div className="tools">
      <h4> اعدادات ملفات المستفيدين</h4>

      <Badge>{`يوجد ${benefisiers?.length.toString()}  ملف للاستفادة`}</Badge>

      <hr />
      <RadioGroup
        name="triDossiers"
        items={TriDossiersRadioItems}
        value={TriDossiers}
        onChange={(e) => {
          setTriDossiers(e.target.value);
        }}
      />
      <DropdownButton
        id="dropdown-basic-button"
        variant="info"
        className="flex m-1 "
        title={title}
        disabled={TriDossiers === "date-depo"}
      >
        {quotas?.map((quota) => (
          <Dropdown.Item key={quota._id} onClick={() => setQuotas(quota)}>
            {quota.quotaname}
          </Dropdown.Item>
        ))}
      </DropdownButton>
      <RadioGroup
        name="photoFemme"
        items={PhotoFemmeRadioItems}
        value={PhotoFemme}
        onChange={(e) => {
          setPhotoFemme(e.target.value);
        }}
      />

      <Button
        variant="success"
        className="m-1 "
        onClick={() =>
          onGetBenefisiersList(benefisiers, "french", TriDossiers, PhotoFemme)
        }
      >
        انشاء ملف المستفيدين بالفرنسية
      </Button>

      <Button
        variant="success"
        className="m-1 "
        onClick={() =>
          onGetBenefisiersList(benefisiers, "frenchr", TriDossiers, PhotoFemme)
        }
      >
        انشاء ملف الاحتياطيين بالفرنسية
      </Button>

      <Button
        variant="success"
        className="m-1 "
        onClick={() =>
          onGetBenefisiersList(benefisiers, "arabic", TriDossiers, PhotoFemme)
        }
      >
        انشاء ملف المستفيدين
      </Button>

      <Button
        variant="success"
        className="m-1 "
        onClick={() =>
          onGetBenefisiersList(benefisiers, "arabicr", TriDossiers, PhotoFemme)
        }
      >
        انشاء ملف الاحتياطيين
      </Button>
      <Button
        variant="success"
        className="m-1 "
        onClick={() => onGetBenefisiersList([], "export", TriDossiers)}
      >
        استخراج الملف الكامل
      </Button>

      <Button
        variant="danger"
        className="m-1 "
        onClick={dellAllDossiersFromBenefisiers}
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
