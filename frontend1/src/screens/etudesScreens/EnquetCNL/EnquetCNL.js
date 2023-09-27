import React from "react";
import MainScreen from "../../../components/MainScreen/MainScreen";
import { ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";

import SingleDossier from "../../dossiersScreens/Dossiers/SingleDossier";
import EnqTools from "./EnqTools";

function EnquetCNL() {
  const filesToCheck = useSelector((state) => state.filesToCheck);
  const { filesInfo } = filesToCheck;
  const { files } = filesInfo;

  return (
    <MainScreen title={"التحقيق"}>
      <ListGroup>
        {files?.map((dossierMap) => (
          <SingleDossier dossierMap={dossierMap} key={dossierMap._id} />
        ))}
      </ListGroup>
      <EnqTools />
    </MainScreen>
  );
}

export default EnquetCNL;
