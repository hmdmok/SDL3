import React from "react";

import {
  Navbar,
  Nav,
  NavDropdown,
  Button,
  Form,
  Container,
  Dropdown,
  Badge,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import apartment from "./apartment.png";
import { logout } from "../../actions/userActions";
import {
  AiFillDelete,
  AiFillTrophy,
  AiOutlineFileSearch,
} from "react-icons/ai";
import DropdownMenu from "react-bootstrap/esm/DropdownMenu";
import { deleteFile } from "../../actions/filesActions";
import { deleteBenefisier } from "../../actions/benifisierActions";

const Navigation = () => {
  let history = useNavigate();
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const logedUserType = userInfo?.usertype;

  const filesToCheck = useSelector((state) => state.filesToCheck);
  const { filesInfo } = filesToCheck;
  const { files } = filesInfo;

  const filesToBenifits = useSelector((state) => state.filesToBenifits);
  const { benefisiersInfo } = filesToBenifits;
  const { benefisiers } = benefisiersInfo;

  const dellDossierFromCheck = (fileTo) => {
    dispatch(deleteFile(fileTo));
  };

  const dellDossierFromBenefisiers = (fileTo) => {
    dispatch(deleteBenefisier(fileTo));
  };

  function logoutHandler() {
    dispatch(logout());
    history("/");
  }
  function loginHandler() {
    history("/login");
  }

  return (
    <Navbar
      className="d-flex flex-row-reverse text-center"
      bg="primary"
      expand="lg"
      variant="dark"
    >
      <Container className="d-flex flex-row-reverse text-center">
        <Navbar.Brand href="/">
          <img src={apartment} alt="logo" width="50" height="50" />
        </Navbar.Brand>
        {userInfo && (
          <Nav className="d-flex flex-row-reverse text-center">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse
              className="d-lg-flex flex-lg-row-reverse justify-content-lg-between text-center"
              id="basic-navbar-nav"
            >
              <Nav className="d-lg-flex flex-lg-row-reverse mx-2 text-center">
                {(logedUserType === "admin" || logedUserType === "agent") && (
                  <>
                    <NavDropdown
                      className="text-center"
                      title="تسيير الملف"
                      id="basic-nav-dropdown"
                    >
                      <NavDropdown.Item href="/demandeur">
                        حجز ملف طلب السكن
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/dossiers">
                        قائمة ملفات طلب السكن
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                      <NavDropdown.Item onClick={logoutHandler}>
                        تسجيل خروج
                      </NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown
                      title="تسيير الحصص"
                      id="basic-nav-dropdown"
                    >
                      <NavDropdown.Item href="/quotas">
                        قائمة الحصص
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/addquota">
                        اظافة حصة
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                    </NavDropdown>
                    <NavDropdown title="تسيير الدراسة" id="basic-nav-dropdown">
                      <NavDropdown.Item href="/enquetCNL">
                        قائمة تحقيق
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/listBenifisiaire">
                        قائمة المستفيدين
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                    </NavDropdown>
                    <NavDropdown title="تسيير البيانات" id="basic-nav-dropdown">
                      <NavDropdown.Item href={"/importationData"}>
                        استيراد بيانات طالبي السكن
                      </NavDropdown.Item>
                      <NavDropdown.Item href={"/importationDemPhoto"}>
                        استيراد صور طالبي السكن
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                    </NavDropdown>
                  </>
                )}

                {logedUserType === "super" && (
                  <>
                    <NavDropdown
                      title="تسيير المستخدمين"
                      id="basic-nav-dropdown"
                    >
                      <NavDropdown.Item href="/users">
                        قائمة المستخدمين
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/adduser">
                        اظافة مستخدم
                      </NavDropdown.Item>
                      <NavDropdown.Divider />
                    </NavDropdown>
                    <NavDropdown title="اعدادات" id="basic-nav-dropdown">
                      <NavDropdown.Item href="/willaya">
                        قائمة الولايات
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/commune">
                        قائمة البلديات
                      </NavDropdown.Item>
                      <NavDropdown.Item href="/tableNotes">
                        جدول التنقيط
                      </NavDropdown.Item>
                    </NavDropdown>
                  </>
                )}

                <Nav.Link href="/help">مساعدة</Nav.Link>
                <Nav.Link href="/contact">اتصل بنا</Nav.Link>
                <Dropdown>
                  <Dropdown.Toggle
                    variant="success"
                    className="mx-2"
                    title="ملفات للتحقيق"
                    id="basic-nav-dropdown"
                  >
                    <AiOutlineFileSearch />
                    <Badge className="m-1">{files.length}</Badge>
                  </Dropdown.Toggle>
                  <DropdownMenu style={{ minWidth: 370 }}>
                    {files.length > 0 ? (
                      <>
                        {files.map((file) => (
                          <span className="file" key={file._id}>
                            <div className="fileDetail">
                              <span>N: {file.num_dos}</span>
                              <span>Nom: {file.demandeur?.nom_fr}</span>
                              <span>Prenom: {file.demandeur?.prenom_fr}</span>
                            </div>
                            <AiFillDelete
                              fontSize={"20px"}
                              style={{ cursor: "pointer" }}
                              onClick={() => dellDossierFromCheck(file)}
                            />
                          </span>
                        ))}
                        <Link to="/enquetCNL">
                          <Button style={{ width: "95%", margin: "0 10px" }}>
                            صفحة ملفات التحقيق
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <span style={{ padding: 10 }}>لا توجد ملفات</span>
                    )}
                  </DropdownMenu>
                </Dropdown>
                <Dropdown>
                  <Dropdown.Toggle
                    variant="success"
                    className="mx-2"
                    title="ملفات المستفيدين"
                    id="basic-nav-dropdown"
                  >
                    <AiFillTrophy />
                    <Badge className="m-1">{benefisiers.length}</Badge>
                  </Dropdown.Toggle>
                  <DropdownMenu style={{ minWidth: 370 }}>
                    {benefisiers.length > 0 ? (
                      <>
                        {benefisiers.map((file) => (
                          <span className="file" key={file._id}>
                            <div className="fileDetail">
                              <span>N: {file.num_dos}</span>
                              <span>Nom: {file.demandeur?.nom_fr}</span>
                              <span>Prenom: {file.demandeur?.prenom_fr}</span>
                            </div>
                            <AiFillDelete
                              fontSize={"20px"}
                              style={{ cursor: "pointer" }}
                              onClick={() => dellDossierFromBenefisiers(file)}
                            />
                          </span>
                        ))}
                        <Link to="/listBenifisiaire">
                          <Button style={{ width: "95%", margin: "0 10px" }}>
                            صفحة ملفات المستفيدين
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <span style={{ padding: 10 }}>لا توجد ملفات</span>
                    )}
                  </DropdownMenu>
                </Dropdown>
              </Nav>
            </Navbar.Collapse>
          </Nav>
        )}
        <Form className="d-flex">
          {userInfo ? (
            <Button
              onClick={logoutHandler}
              className="mx-1"
              variant="outline-dark"
              size="lg"
            >
              تسجيل خروج
            </Button>
          ) : (
            <Button
              onClick={loginHandler}
              className="mx-1"
              variant="outline-dark"
              size="lg"
            >
              تسجيل دخول
            </Button>
          )}
        </Form>
      </Container>
    </Navbar>
  );
};
export default Navigation;
