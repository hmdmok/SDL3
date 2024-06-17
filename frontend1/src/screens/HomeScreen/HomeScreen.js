import React from "react";
import Logo from "../../components/Logo/Logo";
import MainScreen from "../../components/MainScreen/MainScreen";
import file from "./file.png";
import update from "./update.png";
import { Container, Row } from "react-bootstrap";

function HomeScreen() {
  const creatorData = localStorage.getItem("userInfo");
  const creatorInfo = JSON.parse(creatorData);
  const logedUsername = creatorInfo.username;
  const logedPhotoLink = creatorInfo.photo_link;
  const logedUserType = creatorInfo.usertype;

  return (
    <MainScreen title={"الصفحة الرئيسة"}>
      <Row className="d-flex">
        <Container className="d-flex justify-content-center">
          <Logo
            root={`/userProfile/${creatorInfo._id}`}
            title={logedUsername}
            pic={logedPhotoLink}
          />
        </Container>
      </Row>
      <Row className="d-flex  flex-row-reverse">
        <Container className="d-flex justify-content-center">
          <Logo root={"/dossiers"} title={"قائمة الملفات"} pic={file} />
          <Logo root={"/adddossiers"} title={"تحرير ملف"} pic={update} />
          <Logo root={"/tableNotes"} title={"جدول النقاط"} pic={update} />
          <Logo root={"/quotas"} title={"قائمة الحصص"} pic={file} />
          <Logo root={"/addQuota"} title={"اظافة حصة"} pic={update} />

          {logedUserType === "super" && (
            <>
              <Logo root={"/users"} title={"قائمة المستخدمين"} pic={file} />
              <Logo root={"/addUser"} title={"اظافة مستخدم"} pic={update} />
            </>
          )}
        </Container>
      </Row>
    </MainScreen>
  );
}

export default HomeScreen;
