import React from "react";
import SingleDossier from "./SingleDossier";
import { Badge, Card, ListGroup } from "react-bootstrap";

function ListDossiers({
  title,
  setShowPopup,
  deleteHandler,
  setIdToDel,
  dossiers,
}) {
  return (
    <ListGroup>
      <div className="">
        <h3 style={{ display: "flex", flexDirection: "row-reverse" }}>
          {title}
        </h3>
        <Card style={{ display: "flex", flexDirection: "row-reverse" }}>
          <ListGroup variant="flush" style={{ width: "9rem" }}>
            <Badge bg="warning" text="dark" style={{ height: "40px" }}>
              {" Nom:"}
            </Badge>
          </ListGroup>
          <ListGroup variant="flush" style={{ width: "9rem" }}>
            <Badge bg="warning" text="dark" style={{ height: "40px" }}>
              Prenom:
            </Badge>
          </ListGroup>
          <ListGroup variant="flush" style={{ width: "9rem" }}>
            <Badge bg="warning" text="dark" style={{ height: "40px" }}>
              Date naissance:
            </Badge>
          </ListGroup>

          <ListGroup variant="flush" style={{ width: "7rem" }}>
            <Badge bg="warning" text="dark" style={{ height: "40px" }}>
              {"Num Doss:"}
            </Badge>
          </ListGroup>

          <ListGroup variant="flush" style={{ width: "5rem" }}>
            <Badge bg="warning" text="dark" style={{ height: "40px" }}>
              {"Notes:"}
            </Badge>
          </ListGroup>

          <ListGroup variant="flush" style={{ width: "7rem" }}>
            <Badge bg="warning" text="dark" style={{ height: "40px" }}>
              {"Situation:"}
            </Badge>
          </ListGroup>

          <ListGroup variant="flush" style={{ width: "8rem" }}>
            <Badge bg="warning" text="dark" style={{ height: "40px" }}>
              {"Date depot:"}
            </Badge>
          </ListGroup>
        </Card>
      </div>
      {dossiers?.data?.map((brother) => {
        return (
          <SingleDossier
            dossierMap={brother}
            key={brother._id + "brother2"}
            setShowPopup={setShowPopup}
            deleteHandler={deleteHandler}
            setIdToDel={setIdToDel}
          />
        );
      })}
    </ListGroup>
  );
}

export default ListDossiers;
