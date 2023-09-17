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
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import apartment from "./apartment.png";
import { logout } from "../../actions/userActions";
import { IoDocumentsOutline } from "react-icons/io5";
import DropdownMenu from "react-bootstrap/esm/DropdownMenu";

const Navigation = () => {
  let history = useNavigate();
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;
  const logedUserType = userInfo?.usertype;

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
                    className="mx-5"
                    title="ملفات للتحقيق"
                    id="basic-nav-dropdown"
                  >
                    <IoDocumentsOutline />
                    <Badge>0</Badge>
                  </Dropdown.Toggle>
                  <DropdownMenu style={{ minWidth: 370 }}>
                    <span style={{ padding: 10 }}>لا توجد ملفات</span>
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
