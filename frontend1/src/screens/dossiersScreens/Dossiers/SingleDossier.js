import React from "react";
import { Badge, Button, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { deleteDossierAction } from "../../../actions/dossierActions";
import { addFile, deleteFile } from "../../../actions/filesActions";
import {
  addBenefisier,
  deleteBenefisier,
} from "../../../actions/benifisierActions";
import { getCivility } from "../../../Functions/functions";
import { Link } from "react-router-dom";

const SingleDossier = ({ dossierMap }) => {
  const dispatch = useDispatch();

  const filesToCheck = useSelector((state) => state.filesToCheck);
  const { filesInfo } = filesToCheck;
  const { files } = filesInfo;

  const filesToBenifits = useSelector((state) => state.filesToBenifits);
  const { benefisiersInfo } = filesToBenifits;
  const { benefisiers } = benefisiersInfo;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const deleteHandler = (id) => {
    dispatch(deleteDossierAction(id));
  };

  const addDossierToCheck = (fileTo) => {
    dispatch(addFile(fileTo));
  };

  const dellDossierFromCheck = (fileTo) => {
    dispatch(deleteFile(fileTo));
  };

  const addDossierToBenefisiers = (fileTo) => {
    dispatch(addBenefisier(fileTo));
  };

  const dellDossierFromBenefisiers = (fileTo) => {
    dispatch(deleteBenefisier(fileTo));
  };

  return (
    <div className="file">
      <Card
        style={{ display: "flex", flexDirection: "row-reverse", flex: "auto" }}
      >
        <Badge bg="warning" text="dark" style={{ margin: "5px", flex: "auto" }}>
          Nom: {dossierMap.demandeur?.nom_fr}{" "}
        </Badge>
        <Badge bg="light" text="dark" style={{ margin: "5px", flex: "auto" }}>
          Prenom: {dossierMap.demandeur?.prenom_fr}
        </Badge>
        <Badge bg="warning" text="dark" style={{ margin: "5px", flex: "auto" }}>
          Date naissance: {dossierMap.demandeur?.date_n}
        </Badge>
        <Badge bg="light" text="dark" style={{ margin: "5px", flex: "auto" }}>
          Dossier num: {dossierMap.num_dos}
        </Badge>
        <Badge bg="warning" text="dark" style={{ margin: "5px", flex: "auto" }}>
          Notes: {dossierMap.notes}
        </Badge>
        <Badge bg="light" text="dark" style={{ margin: "5px", flex: "auto" }}>
          Situation: {getCivility(dossierMap?.demandeur?.stuation_f, "f")}
        </Badge>
        <Badge bg="warning" text="dark" style={{ margin: "5px", flex: "auto" }}>
          Date depot: {dossierMap?.date_depo}
        </Badge>

        <Button variant="success" className="m-1">
          <Link to={`/adddossiers/${dossierMap._id}`}> تعديل الملف</Link>
        </Button>
        {files?.some((f) => f._id === dossierMap._id) ? (
          <Button
            variant="success"
            className="m-1"
            onClick={() => dellDossierFromCheck(dossierMap)}
          >
            حذف الملف من التحقيق
          </Button>
        ) : (
          <Button
            variant="success"
            className="m-1"
            onClick={() => addDossierToCheck(dossierMap)}
          >
            اظافة الملف للتحقيق
          </Button>
        )}
        {benefisiers?.some((f) => f._id === dossierMap._id) ? (
          <Button
            variant="success"
            className="m-1"
            onClick={() => dellDossierFromBenefisiers(dossierMap)}
          >
            حذف الملف من المستفيدين
          </Button>
        ) : (
          <Button
            variant="success"
            className="m-1"
            onClick={() => addDossierToBenefisiers(dossierMap)}
          >
            اظافة الملف للمستفيدين
          </Button>
        )}

        {userInfo.usertype === "super" ? (
          <Button
            onClick={() => {
              deleteHandler(dossierMap._id);
            }}
            variant="danger"
            className="m-1"
          >
            حذف
          </Button>
        ) : null}
      </Card>
    </div>
  );
};

export default SingleDossier;
