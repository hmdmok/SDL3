import React from "react";
import { Card } from "react-bootstrap";
import MainScreen from "../../components/MainScreen/MainScreen";

function Contact() {
  return (
    <MainScreen title={"للتواصل معنا"}>
      <Card style={{ width: "17rem" }}>
        <Card.Header as="h3">يمكنكم التواصل معنا عبر هذه القنوات:</Card.Header>
        <Card.Body>
          <Card.Title>العنوان تقرت</Card.Title>

          <Card.Title>+ 213 ** ** ** ** **</Card.Title>

          <a href="mailto:hmd.moknine@gmail.com">
            hmd.moknine@gmail.com
          </a>
        </Card.Body>
      </Card>
    </MainScreen>
  );
}

export default Contact;
