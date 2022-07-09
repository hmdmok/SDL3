import React from "react";

import {
  Navbar,
  Nav,
  NavDropdown,
  Button,
  Form,
  Container,
} from "react-bootstrap";
import apartment from "./apartment.png";

const Navigation = () => {
  return (
    <Navbar bg="primary" expand="lg" variant="dark">
      <Container className="d-flex flex-row-reverse text-center">
        <Navbar.Brand href="/">
          <img src={apartment} alt="logo" width="50" height="50" />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse
          className="d-lg-flex flex-lg-row-reverse justify-content-lg-between text-center"
          id="basic-navbar-nav"
        >
          <Nav className="d-lg-flex flex-lg-row-reverse mx-2 text-center">
            <NavDropdown
              className="text-center"
              title="تسيير الملف"
              id="basic-nav-dropdown"
            >
              <NavDropdown.Item
               href="#addperson"
              >
                تسجيل طالب سكن
              </NavDropdown.Item>
              <NavDropdown.Item
                 href="/adddossiers"
              >
                حجز ملف طلب السكن
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                ملف طلب السكن الرقمي
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">
                تحيين ملف طلب السكن
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">
                قائمة ملفات طلب السكن
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/">تسجيل خروج</NavDropdown.Item>
              <NavDropdown.Item href="/Login">تغيير المستخدم</NavDropdown.Item>
            </NavDropdown>
            <NavDropdown title="تسيير الدراسة" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.3">
                محاضر الحصص
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">
                محاضر الاستفادة
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => {
                  // history.push("/EnquetCNL");
                }}
              >
                قائمة تحقيق CNL
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">
                قائمة تحقيق CNAS
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">
                قائمة تحقيق CASNOS
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">
                قائمة المستفيدين
              </NavDropdown.Item>
              <NavDropdown.Divider />
            </NavDropdown>
            <NavDropdown title="تسيير البيانات" id="basic-nav-dropdown">
              <NavDropdown.Item
                onClick={() => {
                  // history.push("/OldRegister");
                }}
              >
                استيراد بيانات طالبي السكن
              </NavDropdown.Item>
              <NavDropdown.Divider />
            </NavDropdown>
            <NavDropdown title="تسيير المستخدمين" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.3">
                قائمة المستخدمين
              </NavDropdown.Item>
              <NavDropdown.Item href="/adduser">
                تسيير المستخدمين
              </NavDropdown.Item>
              <NavDropdown.Divider />
            </NavDropdown>
            <NavDropdown title="اعدادات" id="basic-nav-dropdown">
              <NavDropdown.Item href="/ًWillaya">
                قائمة الولايات
              </NavDropdown.Item>
              <NavDropdown.Item href="/Commune">
                {" "}
                قائمة البلديات
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => {
                  // // history.push("/TableNotes");
                }}
              >
                جدول التنقيط
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link href="#help">مساعدة</Nav.Link>
          </Nav>
          <Form>
            <Button href="/" className="mx-1" variant="outline-secondary">
              تسجيل خروج
            </Button>
            <Button
              onClick={() => {
                // history.push("/Contact");
              }}
              className="mx-1"
              variant="outline-secondary"
            >
              اتصل بنا
            </Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
export default Navigation;
