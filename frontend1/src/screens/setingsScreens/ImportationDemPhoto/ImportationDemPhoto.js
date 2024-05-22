import React, { useState } from "react";
import MainScreen from "../../../components/MainScreen/MainScreen";
import { Card, Form } from "react-bootstrap";
import ImportPhotoTools from "./ImportPhotoTools";

function ImportationDemPhoto() {
  const [photo_files, setPhoto_files] = useState(null);
  return (
    <MainScreen title="تحميل صور طالبي السكن">
      {/* {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
      {message && <ErrorMessage variant="info">{message}</ErrorMessage>}
      {loading && <Loading />} */}
      <div className="rigthPanel">
        <ImportPhotoTools photo_files={photo_files} />
      </div>
      <div className="fileContainer">
        <Form>
          <Form.Group controlId="formFile" className="mb-3">
            <Form.Label> صورة المستخدم</Form.Label>
            <Form.Control
              multiple
              type="file"
              name="photo_link"
              placeholder="ادخل صورة المستخدم"
              onChange={(e) => {
                setPhoto_files(Object.values(e.target.files));
              }}
            />
          </Form.Group>
          <Form.Group className="d-flex flex-wrap m-1">
            {photo_files?.map((selectedPhoto, i) => {
              return (
                <Card.Body
                  className="flex-shrink-0"
                  style={{ width: "200px", margin: "10px" }}
                  key={`pic${i}`}
                >
                  <Card.Text>{selectedPhoto.name.split(".")[0]} </Card.Text>
                  <Card.Img
                    src={URL.createObjectURL(selectedPhoto)}
                    width="100px"
                    alt="pic"
                  />
                </Card.Body>
              );
            })}
          </Form.Group>
        </Form>
      </div>
    </MainScreen>
  );
}

export default ImportationDemPhoto;
