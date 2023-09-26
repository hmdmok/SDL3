import React from "react";
import { Accordion, Button, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import MainScreen from "../../../components/MainScreen/MainScreen";
import { deleteDossierAction } from "../../../actions/dossierActions";
import { addFile, deleteFile } from "../../../actions/filesActions";
import ErrorMessage from "../../../components/ErrorMessage";
import Loading from "../../../components/Loading";
import Tools from "./Tools";
import Filters from "./Filters";
import SingleDossier from "./SingleDossier";

function Dossiers() {
  const dispatch = useDispatch();

  const filesToCheck = useSelector((state) => state.filesToCheck);
  const { filesInfo } = filesToCheck;
  const { files } = filesInfo;

  const dossierList = useSelector((state) => state.dossierList);
  const { loading, dossiers, error } = dossierList;

  const dossierDelete = useSelector((state) => state.dossierDelete);
  const { loading: loadingDossierDelete, error: errorDossierDelete } =
    dossierDelete;

  return (
    <>
      <div className="alerts">
        {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
        {loading && <Loading />}

        {errorDossierDelete && (
          <ErrorMessage variant="danger">{errorDossierDelete}</ErrorMessage>
        )}
        {loadingDossierDelete && <Loading />}
      </div>
      <MainScreen title={"البحث عبر الملفات "}>
        <div className="rigthPanel">
          <Tools />
          <Filters />
        </div>

        <div className="fileContainer">
          {dossiers?.map((dossierMap, i, passed) => {
            return (
              <SingleDossier dossierMap={dossierMap} key={dossierMap._id} />
            );
          })}
        </div>
      </MainScreen>
    </>
  );
}

export default Dossiers;
