import React from "react";
import { Badge, Button, Card, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addFile, deleteFile } from "../../../actions/filesActions";
import {
  addBenefisier,
  deleteBenefisier,
} from "../../../actions/benifisierActions";
import { getCivility } from "../../../Functions/functions";
import { Link } from "react-router-dom";

const SingleDossier = ({ dossierMap, setShowPopup, setIdToDel }) => {
  const dispatch = useDispatch();

  const filesToCheck = useSelector((state) => state.filesToCheck);
  const { filesInfo } = filesToCheck;
  const { files } = filesInfo;

  const filesToBenifits = useSelector((state) => state.filesToBenifits);
  const { benefisiersInfo } = filesToBenifits;
  const { benefisiers } = benefisiersInfo;

  // const userLogin = useSelector((state) => state.userLogin);
  // const { userInfo } = userLogin;
  const handleDeleteClick = (id) => {
    setIdToDel(id);
    setShowPopup(true); // Show the confirmation popup
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
          <Badge style={{ height: "40px" }}>
            {dossierMap.demandeur?.nom_fr}
          </Badge>
        </ListGroup>

        <ListGroup variant="flush" style={{ width: "9rem" }}>
          <Badge style={{ height: "40px" }}>
            {dossierMap.demandeur?.prenom_fr}
          </Badge>
        </ListGroup>

        <ListGroup variant="flush" style={{ width: "9rem" }}>
          <Badge style={{ height: "40px" }}>
            {dossierMap.demandeur?.date_n}
          </Badge>
        </ListGroup>

        <ListGroup variant="flush" style={{ width: "7rem" }}>
          <Badge style={{ height: "40px" }}>{dossierMap.num_dos}</Badge>
        </ListGroup>

        <ListGroup variant="flush" style={{ width: "5rem" }}>
          <Badge style={{ height: "40px" }}>{dossierMap.notes}</Badge>
        </ListGroup>

        <ListGroup variant="flush" style={{ width: "7rem" }}>
          <Badge style={{ height: "40px" }}>
            {getCivility(dossierMap?.demandeur?.stuation_f, "f")}
          </Badge>
        </ListGroup>

        <ListGroup variant="flush" style={{ width: "8rem" }}>
          <Badge style={{ height: "40px" }}>{dossierMap?.date_depo}</Badge>
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

        <Button
          onClick={() => handleDeleteClick(dossierMap._id)}
          variant="danger"
          className="m-1"
        >
          حذف
        </Button>
      </Card>
    </div>
  );
};

export default SingleDossier;
