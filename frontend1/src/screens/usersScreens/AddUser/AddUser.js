import React, { useEffect, useState } from "react";
import { Card, Form } from "react-bootstrap";
import ErrorMessage from "../../../components/ErrorMessage";
import Loading from "../../../components/Loading";
import MainScreen from "../../../components/MainScreen/MainScreen";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { add } from "../../../actions/userActions";

function AddUser() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [birthday, setBirthday] = useState("");
  const [phone, setPhone] = useState("");
  const [usertype, setUsertype] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repassword, setRepassword] = useState("");
  const [email, setEmail] = useState("");
  const photo_link = "usersPicUpload/default.png";
  const [photo_file, setPhoto_file] = useState(null);
  const [remark, setRemark] = useState("");
  const [message, setMessage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [creator, setCreator] = useState("");

  const creatorData = localStorage.getItem("userInfo");
  const creatorInfo = JSON.parse(creatorData);
  const creatorUsername = creatorInfo.username;

  useEffect(() => {
    setCreator(creatorUsername);
  }, [creatorUsername]);

  const dispatch = useDispatch();
  const userAdd = useSelector((state) => state.userAdd);

  const { loading, error, userInfo } = userAdd;

  let navigate = useNavigate();

  useEffect(() => {
    if (userInfo) {
      navigate("/home");
    }
  }, [navigate, userInfo]);

  useEffect(() => {
    if (photo_file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(photo_file);
    } else {
      setPreview(null);
    }
  }, [photo_file]);

  const onSubmitUtilisateur = async (event) => {
    event.preventDefault();

    if (password !== repassword) {
      setMessage("?????? ???? ?????????? ???????? ????????");
    } else {
      dispatch(
        add(
          firstname,
          username,
          lastname,
          usertype,
          password,
          birthday,
          creator,
          remark,
          email,
          phone,
          photo_file
        )
      );
    }
  };

  return (
    <MainScreen title="?????????? ???????????? ????????">
      {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
      {message && <ErrorMessage variant="danger">{message}</ErrorMessage>}
      {loading && <Loading />}
      <Form onSubmit={onSubmitUtilisateur}>
        <Form.Group className="row text-right">
          <Form.Group className="col order-last">
            <Form.Label htmlFor="Form.ControlFirstName" className="text-right">
              ??????????
            </Form.Label>
            <Form.Control
              value={firstname}
              name="firstname"
              onChange={(e) => setFirstname(e.target.value)}
              type="text"
              id="Form.ControlFirstName"
              className="form-control text-right"
              placeholder="?????????? "
              autoFocus
            />
          </Form.Group>
          <Form.Group className="col order-first">
            <Form.Label htmlFor="Form.ControlLastName" className="text-right">
              ??????????
            </Form.Label>
            <Form.Control
              value={lastname}
              name="lastname"
              onChange={(e) => setLastname(e.target.value)}
              type="name"
              id="Form.ControlLastName"
              className="form-control text-right"
              placeholder="??????????"
            />
          </Form.Group>
        </Form.Group>
        <Form.Group className="row text-right">
          <Form.Group className="col">
            <Form.Label htmlFor="Form.ControlBirthday" className="">
              ?????????? ??????????????
            </Form.Label>
            <Form.Control
              value={birthday}
              name="birthday"
              onChange={(e) => {
                setBirthday(e.target.value);
              }}
              type="date"
              id="Form.ControlBirthday"
              className="form-control text-right"
              placeholder="?????????? ??????????????"
              required
            />
          </Form.Group>
          <Form.Group className="col order-first">
            <Form.Label htmlFor="Form.ControlTelephone" className="">
              ?????? ????????????
            </Form.Label>
            <Form.Control
              value={phone}
              name="phone"
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              id="Form.ControlTelephone"
              className="form-control text-right"
              placeholder="?????? ????????????"
              required
            />
          </Form.Group>
        </Form.Group>
        <Form.Group className="row text-right">
          <Form.Group className="col">
            <Form.Label htmlFor="Form.ControlUsertype" className="">
              ?????????? ????????????????
            </Form.Label>
            <select
              value={usertype}
              name="usertype"
              onChange={(e) => setUsertype(e.target.value)}
              id="Form.ControlUsertype"
              className="form-control text-right"
              placeholder="?????????? ????????????????"
              required
            >
              <option value="-1" disabled hidden>
                ?????????? ????????????????
              </option>
              <option value="super">????????</option>
              <option value="admin">????????</option>
              <option value="agent">?????? ??????</option>
            </select>
          </Form.Group>
          <Form.Group className="col">
            <Form.Label htmlFor="Form.ControlUsername" className="">
              ?????? ????????????????
            </Form.Label>
            <Form.Control
              value={username}
              name="username"
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              id="Form.ControlUsername"
              className="form-control text-right"
              placeholder="?????? ????????????????"
              required
            />
          </Form.Group>
        </Form.Group>
        <Form.Group className="row text-right">
          <Form.Group className="col order-last">
            <Form.Label htmlFor="Form.ControlPassword" className="">
              ???????? ????????
            </Form.Label>
            <Form.Control
              value={password}
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              id="Form.ControlPassword"
              className="form-control text-right"
              placeholder="???????? ????????"
              required
            />
          </Form.Group>
          <Form.Group className="col">
            <Form.Label htmlFor="Form.ControlRepassword" className="">
              ?????????? ???????? ????????
            </Form.Label>
            <Form.Control
              value={repassword}
              name="repassword"
              onChange={(e) => setRepassword(e.target.value)}
              type="password"
              id="Form.ControlRepassword"
              className="form-control text-right"
              placeholder="?????????? ???????? ????????"
              required
            />
          </Form.Group>
        </Form.Group>
        <Form.Group className="row text-right">
          <Form.Group className="col">
            <Form.Label htmlFor="Form.ControlEmail" className="">
              ???????? ???????????? ????????????????????
            </Form.Label>
            <Form.Control
              value={email}
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              id="Form.ControlEmail"
              className="form-control text-right"
              placeholder="???????????? ????????????????????"
              required
            />
          </Form.Group>
        </Form.Group>

        <Form.Group className="row">
          <Form.Group className="col">
            <Card.Body>
              <Card.Text>???????? ????????????????</Card.Text>
            </Card.Body>
            {preview ? (
              <Card.Img src={preview} width="300px" alt="pic" />
            ) : (
              <Card.Img
                src={`http://localhost:4000/${photo_link}`}
                width="300px"
                alt="pic"
              />
            )}
          </Form.Group>
          <Form.Group className="d-flex align-items-center col-9">
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label> ???????? ????????????????</Form.Label>
              <Form.Control
                type="file"
                name="photo_link"
                placeholder="???????? ???????? ????????????????"
                onChange={(e) => setPhoto_file(e.target.files[0])}
              />
            </Form.Group>
          </Form.Group>
        </Form.Group>
        <Form.Group className="row">
          <Form.Group className="col">
            <Form.Label htmlFor="inpuRemark" className="">
              ??????????????
            </Form.Label>
            <Form.Control
              value={remark}
              name="remark"
              onChange={(e) => setRemark(e.target.value)}
              type="text"
              id="Form.ControlRemark"
              className="form-control text-right"
              placeholder="?????????????? "
            />
          </Form.Group>
        </Form.Group>
        <hr />
        <Form.Group className="row">
          <Form.Group className="col order-last">
            <Form.Control
              className="btn btn-lg btn-primary btn-block"
              type="submit"
              value="  ?????????? ????????????"
            />
          </Form.Group>
          <Form.Group className="col">
            <Form.Control
              className="btn btn-lg btn-primary btn-block"
              type="reset"
              value="??????????"
            />
          </Form.Group>
        </Form.Group>
      </Form>
    </MainScreen>
  );
}

export default AddUser;
