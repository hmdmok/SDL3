import React from "react";
import { Badge, Button, Card, ListGroup } from "react-bootstrap";
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
    <div className="">
      <Card style={{ display: "flex", flexDirection: "row-reverse" }}>
        <ListGroup variant="flush" style={{ width: "9rem" }}>
          <Badge bg="warning" text="dark">
            {" Nom:"}
          </Badge>
          <Badge>{dossierMap.demandeur?.nom_fr}</Badge>
        </ListGroup>

        <ListGroup variant="flush" style={{ width: "9rem" }}>
          <Badge bg="warning" text="dark">
            Prenom:
          </Badge>
          <Badge>{dossierMap.demandeur?.prenom_fr}</Badge>
        </ListGroup>

        <ListGroup variant="flush" style={{ width: "9rem" }}>
          <Badge bg="warning" text="dark">
            Date naissance:
          </Badge>
          <Badge>{dossierMap.demandeur?.date_n}</Badge>
        </ListGroup>

        <ListGroup variant="flush" style={{ width: "7rem" }}>
          <Badge bg="warning" text="dark">
            {"Num Doss:"}
          </Badge>
          <Badge>{dossierMap.num_dos}</Badge>
        </ListGroup>

        <ListGroup variant="flush" style={{ width: "5rem" }}>
          <Badge bg="warning" text="dark">
            {"Notes:"}
          </Badge>
          <Badge>{dossierMap.notes}</Badge>
        </ListGroup>

        <ListGroup variant="flush" style={{ width: "7rem" }}>
          <Badge bg="warning" text="dark">
            {"Situation:"}
          </Badge>
          <Badge>{getCivility(dossierMap?.demandeur?.stuation_f, "f")}</Badge>
        </ListGroup>

        <ListGroup variant="flush" style={{ width: "8rem" }}>
          <Badge bg="warning" text="dark">
            {"Date depot:"}
          </Badge>
          <Badge>{dossierMap?.date_depo}</Badge>
        </ListGroup>

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

        <Button variant="success" className="m-1">
          <Link to={`/adddossiers/${dossierMap._id}`}> تعديل الملف</Link>
        </Button>

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
