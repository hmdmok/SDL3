import React, { useEffect } from "react";
import { Badge, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { deleteList } from "../../../actions/filesActions";
import {
  getEnquetCNASAction,
  getEnquetCNLAction,
  getEnquetCASNOSAction,
} from "../../../actions/enquetCNLActions";
import ErrorMessage from "../../../components/ErrorMessage";
import Loading from "../../../components/Loading";
import fileDownload from "js-file-download";

const EnqTools = () => {
  const dispatch = useDispatch();

  const filesToCheck = useSelector((state) => state.filesToCheck);
  const { filesInfo } = filesToCheck;
  const { files } = filesInfo;

  // for EnqCNL
  const enquetCNLGet = useSelector((state) => state.enquetCNLGet);
  const { loading, enquetCNLs, error, success } = enquetCNLGet;

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

  // for EnqCNAS
  const enquetCNASGet = useSelector((state) => state.enquetCNASGet);
  const {
    loading: loadingCNAS,
    enquetCNASs,
    error: errorCNAS,
    success: successCNAS,
  } = enquetCNASGet;

  const onGetEnqCNAS = (listDossierEnquet) => {
    dispatch(getEnquetCNASAction(listDossierEnquet));
  };

  useEffect(() => {
    if (successCNAS) {
      fileDownload(
        enquetCNASs.data,
        enquetCNASs.headers["content-disposition"].split('"')[1]
      );
    }
  }, [dispatch, enquetCNASs, successCNAS]);

  // for EnqCASNOS
  const enquetCASNOSGet = useSelector((state) => state.enquetCASNOSGet);
  const {
    loading: loadingCASNOS,
    enquetCASNOSs,
    error: errorCASNOS,
    success: successCASNOS,
  } = enquetCASNOSGet;

  const onGetEnqCASNOS = (listDossierEnquet) => {
    dispatch(getEnquetCASNOSAction(listDossierEnquet));
  };

  useEffect(() => {
    if (successCASNOS) {
      fileDownload(
        enquetCASNOSs.data,
        enquetCASNOSs.headers["content-disposition"].split('"')[1]
      );
    }
  }, [dispatch, enquetCASNOSs, successCASNOS]);

  // for dell all from files to check
  const dellAllDossiersFromCheck = () => {
    dispatch(deleteList());
  };

  return (
    <div className="tools">
      <h4> اعدادات التحقيق</h4>

      <Badge>{`يوجد ${files?.length.toString()}  ملف للتحقيق`}</Badge>

      <hr />
      <Button
        className="m-1 "
        onClick={() => {
          onGetEnqCNAS(files);
        }}
      >
        انشاء ملف تحقيق CNAS
      </Button>
      <Button
        className="m-1 "
        onClick={() => {
          onGetEnqCASNOS(files);
        }}
      >
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
        {errorCNAS && <ErrorMessage variant="danger">{errorCNAS}</ErrorMessage>}
        {loadingCNAS && <Loading />}
        {errorCASNOS && <ErrorMessage variant="danger">{errorCASNOS}</ErrorMessage>}
        {loadingCASNOS && <Loading />}
      </div>
    </div>
  );
};

export default EnqTools;
