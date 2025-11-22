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
      {dossiers?.map((dossierMap, index) => {
        const main = dossierMap?.mainDossier || {};
        const groupKey = main.matchId || main._id || `group-${index}`;
        return (
          <div key={groupKey}>
            {showBrothersList !== "List" && (
              <div className="">
                <SingleBrothergroup
                  dossierMap={main}
                  key={main.matchId || main._id || `main-${index}`}
                  setShowPopup={setShowPopup}
                  deleteHandler={deleteHandler}
                  setIdToDel={setIdToDel}
                />
                {dossierMap?.brothers?.map((brother, index2) => {
                  const bKey =
                    brother.matchId || brother._id || `${groupKey}-b-${index2}`;
                  return (
                    <SingleBrothergroup
                      dossierMap={brother}
                      key={bKey}
                      setShowPopup={setShowPopup}
                      deleteHandler={deleteHandler}
                      setIdToDel={setIdToDel}
                    />
                  );
                })}
                <hr />
              </div>
            )}
          </div>
        );
      })}
    </ListGroup>
  );
}

export default ListBrothers;
