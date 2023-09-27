import React, { useEffect } from "react";
import { Badge, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { deleteList } from "../../../actions/filesActions";
import { getEnquetCNLAction } from "../../../actions/enquetCNLActions";
import ErrorMessage from "../../../components/ErrorMessage";
import Loading from "../../../components/Loading";
import fileDownload from "js-file-download";

const EnqTools = () => {
  const dispatch = useDispatch();

  const filesToCheck = useSelector((state) => state.filesToCheck);
  const { filesInfo } = filesToCheck;
  const { files } = filesInfo;

  const enquetCNLGet = useSelector((state) => state.enquetCNLGet);
  const { loading, enquetCNLs, error, success } = enquetCNLGet;

  const dellAllDossiersFromCheck = () => {
    dispatch(deleteList());
  };

  const onGetEnqCNL = (listDossierEnquet) => {
    dispatch(getEnquetCNLAction(listDossierEnquet));
  };

  useEffect(() => {
    if (success) {
      fileDownload(
        enquetCNLs.data,
        enquetCNLs.headers["content-disposition"].split('"')[1]
      );
    }
  }, [dispatch, enquetCNLs, success]);

  return (
    <div className="tools">
      <h4> اعدادات التحقيق</h4>

      <Badge>{`يوجد ${files?.length.toString()}  ملف للتحقيق`}</Badge>

      <hr />
      <Button className="m-1 " onClick={() => {}}>
        انشاء ملف تحقيق CNAS
      </Button>
      <Button className="m-1 " onClick={() => {}}>
        انشاء ملف تحقيق CASNOS
      </Button>

      <Button
        variant="success"
        className="m-1 "
        onClick={() => {
          onGetEnqCNL(files);
        }}
      >
        انشاء ملف تحقيق CNL
      </Button>
      <Button
        variant="danger"
        className="m-1 "
        onClick={() => {
          dellAllDossiersFromCheck();
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

export default EnqTools;
