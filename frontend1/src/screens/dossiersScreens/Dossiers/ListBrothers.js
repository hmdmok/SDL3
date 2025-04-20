import React from "react";
import { Badge, Card, ListGroup } from "react-bootstrap";
import SingleBrothergroup from "./SingleBrothergroup";

function ListBrothers({
  title,
  setShowPopup,
  deleteHandler,
  setIdToDel,
  dossiers,
  showBrothersList,
}) {
  return (
    <ListGroup>
      <h3 style={{ display: "flex", flexDirection: "row-reverse" }}>{title}</h3>

      <div className="">
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

          <ListGroup variant="flush" style={{ width: "11rem" }}>
            <Badge bg="warning" text="dark" style={{ height: "40px" }}>
              {"Nom Pere:"}
            </Badge>
          </ListGroup>
          <ListGroup variant="flush" style={{ width: "11rem" }}>
            <Badge bg="warning" text="dark" style={{ height: "40px" }}>
              {"Nom Mere:"}
            </Badge>
          </ListGroup>

          <ListGroup variant="flush" style={{ width: "8rem" }}>
            <Badge bg="warning" text="dark" style={{ height: "40px" }}>
              {"نسبة تطابف الاخوة:"}
            </Badge>
          </ListGroup>
        </Card>
      </div>
      {dossiers?.data?.map((dossierMap) => {
        return (
          <>
            <SingleBrothergroup
              dossierMap={dossierMap}
              key={dossierMap._id + "brother2"}
              setShowPopup={setShowPopup}
              deleteHandler={deleteHandler}
              setIdToDel={setIdToDel}
            />

            {showBrothersList === "FatherBrothers" &&
              dossierMap?.demandeur?.listOfFatherBrothers?.map((brother) => {
                return (
                  <SingleBrothergroup
                    dossierMap={brother}
                    key={brother._id + "brother3"}
                    setShowPopup={setShowPopup}
                    deleteHandler={deleteHandler}
                    setIdToDel={setIdToDel}
                  />
                );
              })}

            {showBrothersList === "MotherBrothers" &&
              dossierMap?.demandeur?.listOfMotherBrothers?.map((brother) => {
                return (
                  <SingleBrothergroup
                    dossierMap={brother}
                    key={brother._id + "brother2"}
                    setShowPopup={setShowPopup}
                    deleteHandler={deleteHandler}
                    setIdToDel={setIdToDel}
                  />
                );
              })}
            <hr />
          </>
        );
      })}
    </ListGroup>
  );
}

export default ListBrothers;
