import React from "react";
import { Badge, Button, Card, ListGroup } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addFile, deleteFile } from "../../../actions/filesActions";
import {
  addBenefisier,
  deleteBenefisier,
} from "../../../actions/benifisierActions";
import { Link } from "react-router-dom";

const SingleBrothergroup = ({ dossierMap, setShowPopup, setIdToDel }) => {
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
    <Card
      style={{
        display: "flex",
        flexDirection: "row-reverse",
      }}
    >
      <ListGroup variant="flush" style={{ width: "9rem" }}>
        <Badge style={{ height: "40px" }}>{dossierMap?.nom_fr}</Badge>
      </ListGroup>

      <ListGroup variant="flush" style={{ width: "9rem" }}>
        <Badge style={{ height: "40px" }}>{dossierMap?.prenom_fr}</Badge>
      </ListGroup>

      <ListGroup variant="flush" style={{ width: "9rem" }}>
        <Badge style={{ height: "40px" }}>{dossierMap?.date_n}</Badge>
      </ListGroup>

      <ListGroup variant="flush" style={{ width: "11rem" }}>
        <Badge style={{ height: "40px" }}>
          {dossierMap?.prenom_p_fr + " " + dossierMap?.nom_fr}
        </Badge>
      </ListGroup>
      <ListGroup variant="flush" style={{ width: "11rem" }}>
        <Badge style={{ height: "40px" }}>
          {dossierMap?.prenom_m_fr + " " + dossierMap?.nom_m_fr}
        </Badge>
      </ListGroup>

      <ListGroup variant="flush" style={{ width: "8rem" }}>
        <Badge style={{ height: "40px" }}>{`${
          dossierMap.similarity || "---"
        } %`}</Badge>
      </ListGroup>

      {files?.some((f) => f.num_dos === dossierMap.num_dos) ? (
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

      {benefisiers?.some((f) => f.num_dos === dossierMap.num_dos) ? (
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
        <Link to={`/adddossiers/${dossierMap.matchId || dossierMap._id}`}>
          {"تعديل الملف"}
        </Link>
      </Button>

      <Button
        onClick={() => handleDeleteClick(dossierMap.matchId || dossierMap._id)}
        variant="danger"
        className="m-1"
      >
        حذف
      </Button>
    </Card>
  );
};

export default SingleBrothergroup;
