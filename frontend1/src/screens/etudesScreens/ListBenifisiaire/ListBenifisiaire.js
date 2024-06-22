import React from "react";
import MainScreen from "../../../components/MainScreen/MainScreen";
import { ListGroup } from "react-bootstrap";
import { useSelector } from "react-redux";
import SingleDossier from "../../dossiersScreens/Dossiers/SingleDossier";
import BeniTools from "./BeniTools";

function ListBenifisiaire() {
  const filesToBenifits = useSelector((state) => state.filesToBenifits);
  const { benefisiersInfo } = filesToBenifits;
  const { benefisiers } = benefisiersInfo;

  return (
    <MainScreen title={"للاستفادة"}>
      <div className="rigthPanel">
        <BeniTools />
      </div>
      <ListGroup>
        {benefisiers?.map((dossierMap) => (
          <SingleDossier dossierMap={dossierMap} key={dossierMap._id} />
        ))}
      </ListGroup>
    </MainScreen>
  );
}

export default ListBenifisiaire;
