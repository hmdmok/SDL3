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
      {dossiers?.data?.map((dossierMap, index) => {
        return (
          <>
            <SingleBrothergroup
              key={dossierMap._id + index}
              dossierMap={dossierMap}
              setShowPopup={setShowPopup}
              deleteHandler={deleteHandler}
              setIdToDel={setIdToDel}
            />

            {showBrothersList === "FatherBrothers" &&
              dossierMap?.demandeur?.listOfFatherBrothers?.map(
                (brother, index2) => {
                  console.log("brother: ",brother);
                  return (
                    <SingleBrothergroup
                      key={brother.matchId + index2}
                      dossierMap={brother}
                      setShowPopup={setShowPopup}
                      deleteHandler={deleteHandler}
                      setIdToDel={setIdToDel}
                    />
                  );
                }
              )}

            {showBrothersList === "MotherBrothers" &&
              dossierMap?.demandeur?.listOfMotherBrothers?.map(
                (brother, index3) => {
                  return (
                    <SingleBrothergroup
                      key={brother.matchId + index3}
                      dossierMap={brother}
                      setShowPopup={setShowPopup}
                      deleteHandler={deleteHandler}
                      setIdToDel={setIdToDel}
                    />
                  );
                }
              )}
            <hr />
          </>
        );
      })}
    </ListGroup>
  );
}

export default ListBrothers;
