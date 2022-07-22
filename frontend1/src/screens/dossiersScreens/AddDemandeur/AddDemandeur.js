import React, { useEffect, useState } from "react";
import { Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { listCommunesByWilayaAction } from "../../../actions/communeActions";
import { listWilayasAction } from "../../../actions/wilayaActions";
import { addDemandeurAction } from "../../../actions/demandeurActions";
import ErrorMessage from "../../../components/ErrorMessage";
import Loading from "../../../components/Loading";
import MainScreen from "../../../components/MainScreen/MainScreen";
import { addDossierAction } from "../../../actions/dossierActions";
import { useNavigate } from "react-router-dom";

function AddDemandeur() {
  const [prenom, setPrenom] = useState("");
  const [prenom_fr, setPrenom_fr] = useState("");
  const [nom, setNom] = useState("");
  const [nom_fr, setNom_fr] = useState("");
  const [gender, setGender] = useState("");
  const [gender_conj, setGender_conj] = useState("");
  const [num_act, setNum_act] = useState("");
  const [date_n, setDate_n] = useState("");
  const [lieu_n, setLieu_n] = useState("");
  const [lieu_n_fr, setLieu_n_fr] = useState("");
  const [wil_n, setWil_n] = useState(0);
  const [com_n, setCom_n] = useState(0);
  const [prenom_p, setPrenom_p] = useState("");
  const [prenom_p_fr, setPrenom_p_fr] = useState("");
  const [prenom_m, setPrenom_m] = useState("");
  const [prenom_m_fr, setPrenom_m_fr] = useState("");
  const [nom_m, setNom_m] = useState("");
  const [nom_m_fr, setNom_m_fr] = useState("");
  const [num_i_n, setNum_i_n] = useState("");
  const [stuation_f, setStuation_f] = useState("");
  const type = "dema";
  const [situation_p, setSituation_p] = useState("chomeur");
  const [profession, setProfession] = useState("");
  const [salaire, setSalaire] = useState("");
  const [creator, setCreator] = useState("");
  const [remark, setRemark] = useState("");

  const [date_depo, setDate_depo] = useState("");
  const [num_dos, setNum_dos] = useState("");
  const [saisi_conj, setSaisi_conj] = useState("");

  const dispatch = useDispatch();

  const demandeurAdd = useSelector((state) => state.demandeurAdd);
  const { loading, demandeur, success, error } = demandeurAdd;

  const dossierAdd = useSelector((state) => state.dossierAdd);
  const {
    loading: loadingDossierAdd,
    dossier,
    success: successDossierAdd,
    error: errorDossierAdd,
  } = dossierAdd;

  const communeGetByWilaya = useSelector((state) => state.communeGetByWilaya);
  const {
    loading: loadingCommunes,
    communes,
    error: errorCommunes,
  } = communeGetByWilaya;

  const wilayaList = useSelector((state) => state.wilayaList);
  const { loading: loadingWilayas, wilayas, error: errorWilayas } = wilayaList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  useEffect(() => {
    setCreator(userInfo.username);
  }, [userInfo]);

  useEffect(() => {
    dispatch(listWilayasAction());
  }, [dispatch]);

  useEffect(() => {
    dispatch(listCommunesByWilayaAction(wil_n));
  }, [dispatch, wil_n]);

  useEffect(() => {
    if (demandeur)
      dispatch(
        addDossierAction(
          creator,
          demandeur?._id,
          "",
          date_depo,
          num_dos,
          "",
          "",
          "",
          "",
          "",
          type,
          gender_conj,
          remark,
          saisi_conj,
          "false"
        )
      );
  }, [
    dispatch,
    success,
    creator,
    demandeur,
    date_depo,
    num_dos,
    type,
    gender_conj,
    remark,
    saisi_conj,
  ]);

  let navigate = useNavigate();

  useEffect(() => {
    if (dossier) navigate(`/adddossiers/${dossier._id}`);
  }, [navigate, successDossierAdd, dossier]);

  const submitDemandeurHandler = (event) => {
    event.preventDefault();
    dispatch(
      addDemandeurAction(
        prenom,
        prenom_fr,
        nom,
        nom_fr,
        gender,
        num_act,
        date_n,
        lieu_n,
        lieu_n_fr,
        wil_n,
        com_n,
        prenom_p,
        prenom_p_fr,
        prenom_m,
        prenom_m_fr,
        nom_m,
        nom_m_fr,
        num_i_n,
        stuation_f,
        type,
        situation_p,
        profession,
        salaire,
        creator,
        remark
      )
    );
  };

  return (
    <MainScreen title={"ادخال معلومات طالب السكن"}>
      {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
      {loading && <Loading />}

      {errorDossierAdd && (
        <ErrorMessage variant="danger">{errorDossierAdd}</ErrorMessage>
      )}
      {loadingDossierAdd && <Loading />}

      {errorWilayas && (
        <ErrorMessage variant="danger">{errorWilayas}</ErrorMessage>
      )}
      {loadingWilayas && <Loading />}

      {errorCommunes && (
        <ErrorMessage variant="danger">{errorCommunes}</ErrorMessage>
      )}
      {loadingCommunes && <Loading />}

      <Form onSubmit={submitDemandeurHandler}>
        <Row className="text-right">
          <Col className="col-sm order-sm-last">
            <label htmlFor="prenom">الاسم</label>
            <input
              type="text"
              id="prenom"
              className="form-control text-right"
              name="prenom"
              placeholder="الاسم"
              onChange={(e) => setPrenom(e.target.value)}
            />
            <input
              onChange={(e) => setPrenom_fr(e.target.value)}
              type="text"
              id="prenom_fr"
              name="prenom_fr"
              className="form-control text-right"
              placeholder="الاسم باللاتينية"
            />
            <br />
          </Col>
          <div className="col-sm order-sm-first">
            <label htmlFor="nom">اللقب</label>
            <input
              onChange={(e) => setNom(e.target.value)}
              type="text"
              id="nom"
              className="form-control text-right"
              name="nom"
              placeholder="اللقب"
            />
            <input
              onChange={(e) => setNom_fr(e.target.value)}
              type="text"
              id="nom_fr"
              name="nom_fr"
              className="form-control text-right"
              placeholder="اللقب باللاتينية"
            />
            <br />
          </div>
        </Row>
        <div className="row text-right">
          <div className="col-sm order-sm-last">
            <div
              name="gender"
              onChange={(e) => {
                setGender(e.target.value);
                if (e.target.value === "m") setGender_conj("f");
                else setGender_conj("m");
              }}
            >
              <label>الجنس</label>
              <br />
              <input type="radio" id="male" name="gender" value="m" />
              <label htmlFor="male" className="form-control text-right">
                ذكر
              </label>
              <br />
              <input type="radio" id="female" name="gender" value="f" />
              <label htmlFor="female" className="form-control text-right">
                أنثى
              </label>
              <br />
            </div>

            <label htmlFor="num_act">رقم عقد الميلاد</label>
            <input
              onChange={(e) => setNum_act(e.target.value)}
              type="text"
              className="form-control text-right"
              name="num_act"
              required
            />
            <br />

            <label htmlFor="date_n">تاريخ الميلاد </label>
            <input
              onChange={(e) => setDate_n(e.target.value)}
              type="date"
              id="date_n"
              className="form-control text-right"
              name="date_n"
              defaultValue="01-01-1900"
              required
            />
            <br />
          </div>
          <div className="col-sm order-sm-first">
            <label htmlFor="wil_n">ولاية الميلاد</label>
            <select
              onChange={(e) => setWil_n(e.target.value)}
              id="wil_n"
              className="form-control text-right"
              name="wil_n"
              defaultValue="-1"
              required
            >
              <option value="-1" disabled hidden>
                اختر ولاية الميلاد
              </option>
              {wilayas?.map((wilaya) => (
                <option key={wilaya._id} value={wilaya.code}>
                  {wilaya.nomAr}
                </option>
              ))}
            </select>
            <br />

            <label htmlFor="lieu_n">مكان الميلاد</label>
            <input
              onChange={(e) => setLieu_n(e.target.value)}
              type="text"
              id="lieu_n"
              className="form-control text-right"
              name="lieu_n"
            />
            <input
              onChange={(e) => setLieu_n_fr(e.target.value)}
              type="text"
              id="lieu_n_fr"
              className="form-control text-right"
              name="lieu_n_fr"
              placeholder="مكان الميلاد باللاتينية"
            />
            <br />

            <label htmlFor="com_n">بلدية الميلاد</label>
            <select
              onChange={(e) => setCom_n(e.target.value)}
              id="com_n"
              className="form-control text-right"
              name="com_n"
              defaultValue="-1"
              required
            >
              <option value="-1" disabled hidden>
                اختر بلدية الميلاد
              </option>
              {communes?.map((commune) => (
                <option key={commune._id} value={commune.code}>
                  {commune.nomAr}
                </option>
              ))}
            </select>
            <br />

            <label htmlFor="prenom_p"> اسم الاب</label>
            <input
              onChange={(e) => setPrenom_p(e.target.value)}
              type="text"
              id="prenom_p"
              className="form-control text-right"
              name="prenom_p"
            />
            <input
              onChange={(e) => setPrenom_p_fr(e.target.value)}
              type="text"
              id="prenom_p_fr"
              className="form-control text-right"
              name="prenom_p_fr"
              placeholder="اسم الاب باللاتينية"
            />
            <br />
          </div>
        </div>

        <div className="row text-right">
          <div className="col-sm order-sm-last">
            <label htmlFor="prenom_m"> اسم الأم</label>
            <input
              onChange={(e) => setPrenom_m(e.target.value)}
              type="text"
              id="prenom_m"
              className="form-control text-right"
              name="prenom_m"
            />
            <input
              onChange={(e) => setPrenom_m_fr(e.target.value)}
              type="text"
              id="prenom_m_fr"
              className="form-control text-right"
              name="prenom_m_fr"
              placeholder="اسم الأم باللاتينية"
            />
            <br />
          </div>
          <div className="col-sm order-sm-first">
            <label htmlFor="nom_m">لقب الأم</label>
            <input
              onChange={(e) => setNom_m(e.target.value)}
              type="text"
              id="nom_m"
              className="form-control text-right"
              name="nom_m"
            />
            <input
              onChange={(e) => setNom_m_fr(e.target.value)}
              type="text"
              id="nom_m_fr"
              className="form-control text-right"
              name="nom_m_fr"
              placeholder="لقب الأم باللاتينية"
            />
            <br />
          </div>
        </div>
        <div className="text-right">
          <label htmlFor="num_i_n"> رقم التعريف الوطني</label>
          <input
            onChange={(e) => setNum_i_n(e.target.value)}
            type="text"
            id="num_i_n"
            className="form-control text-right"
            name="num_i_n"
          />

          <label>الوضعية المهنية</label>
          <br />
          <select
            className="form-control text-right"
            onChange={(e) => setSituation_p(e.target.value)}
            id="hide_situation_p"
            defaultValue="non"
            name="hide_situation_p"
          >
            <option name="situation_p" value="chomeur">
              بطال
            </option>
            <option name="situation_p" value="autre">
              أخر
            </option>
          </select>
          <br />
          <div hidden={situation_p === "chomeur"}>
            <label htmlFor="profession">المهنة</label>
            <br />
            <input
              className="form-control text-right"
              onChange={(e) => setProfession(e.target.value)}
              type="text"
              name="profession"
            />
            <br />
            <label htmlFor="salaire">الدخل</label>
            <br />
            <input
              className="form-control text-right"
              onChange={(e) => setSalaire(e.target.value)}
              type="text"
              name="salaire"
            />
            <br />
          </div>

          <label htmlFor="remark"> ملاحظات</label>
          <input
            onChange={(e) => setRemark(e.target.value)}
            type="text"
            id="remark"
            className="form-control text-right"
            name="remark"
          />
        </div>

        <div
          name="stuation_f"
          onChange={(e) => {
            setStuation_f(e.target.value);
            if (e.target.value === "m") setSaisi_conj("false");
          }}
          className="text-right"
        >
          <div className="intro">
            <label>الحالة العائلية</label>{" "}
          </div>{" "}
          <br />
          <input type="radio" id="cilib" name="stuation_f" value="c" />
          <label htmlFor="cilib" className="form-control text-right">
            أعزب\عزباء{" "}
          </label>
          <br />
          <input type="radio" id="marie" name="stuation_f" value="m" />
          <label htmlFor="marie" className="form-control text-right">
            متزوج\ة
          </label>
          <br />
          <input type="radio" id="divor" name="stuation_f" value="d" />
          <label htmlFor="divor" className="form-control text-right">
            مطلق\ة
          </label>
          <br />
          <input type="radio" id="veuf" name="stuation_f" value="v" />
          <label htmlFor="veuf" className="form-control text-right">
            أرمل\ة
          </label>
          <br />
        </div>
        <hr />

        <div className="col-sm order-sm-last">
          <label htmlFor="date_depo"> تاريخ الإيداع </label>
          <input
            type="date"
            id="date_depo"
            name="date_depo"
            className="form-control text-right"
            onChange={(e) => setDate_depo(e.target.value)}
            required
          />
          <br />

          <label htmlFor="num_dos"> رقم الملف</label>
          <input
            type="text"
            id="num_dos"
            name="num_dos"
            className="form-control text-right"
            onChange={(e) => setNum_dos(e.target.value)}
            required
          />
          <br />
        </div>

        <hr />
        <div className="row text-right">
          <div className="col-sm order-sm-last my-2">
            <input
              type="submit"
              className="btn btn-lg btn-primary btn-block"
              value="حفظ"
            />
          </div>
          <div className="col-sm order-sm-first my-2">
            <input
              type="reset"
              className="btn btn-lg btn-primary btn-block"
              value="إلغاء"
            />
          </div>
        </div>
      </Form>
    </MainScreen>
  );
}

export default AddDemandeur;
