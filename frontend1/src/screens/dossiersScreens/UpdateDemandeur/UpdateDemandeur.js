import { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";

import { listCommunesByWilayaAction } from "../../../actions/communeActions";
import { listWilayasAction } from "../../../actions/wilayaActions";
import {
  getDemandeurAction,
  updateDemandeurAction,
} from "../../../actions/demandeurActions";
import ErrorMessage from "../../../components/ErrorMessage";
import Loading from "../../../components/Loading";
import MainScreen from "../../../components/MainScreen/MainScreen";
import {
  getDossierAction,
  updateDossierAction,
} from "../../../actions/dossierActions";

function UpdateDemandeur() {
  const { id } = useParams();
  let navigate = useNavigate();

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

  const demandeurGet = useSelector((state) => state.demandeurGet);
  const {
    loading: loadingdemandeurGet,
    demandeur,
    error: errordemandeurGet,
  } = demandeurGet;

  const dossierGet = useSelector((state) => state.dossierGet);
  const {
    loading: loadingdossierGet,
    dossier,
    error: errordossierGet,
  } = dossierGet;

  const demandeurUpdate = useSelector((state) => state.demandeurUpdate);
  const {
    loading: loadingdemandeurUpdate,
    demandeur: UpdatedDemandeur,
    error: errordemandeurUpdate,
  } = demandeurUpdate;

  const dossierUpdate = useSelector((state) => state.dossierUpdate);
  const {
    loading: loadingDossierUpdate,
    dossier: UpdatedDossier,
    error: errorDossierUpdate,
  } = dossierUpdate;

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
    dispatch(getDossierAction(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (dossier) {
      dispatch(getDemandeurAction(dossier?.id_demandeur));
      setDate_depo(dossier?.date_depo);
      setNum_dos(dossier?.num_dos);
      setSaisi_conj(dossier?.saisi_conj);
    }
  }, [dispatch, dossier]);

  useEffect(() => {
    if (demandeur) {
      setPrenom(demandeur.prenom);
      setPrenom_fr(demandeur.prenom_fr);
      setNom(demandeur.nom);
      setNom_fr(demandeur.nom_fr);
      setGender(demandeur.gender);
      setNum_act(demandeur.num_act);
      setDate_n(demandeur.date_n);
      setLieu_n(demandeur.lieu_n);
      setLieu_n_fr(demandeur.lieu_n_fr);
      setWil_n(demandeur.wil_n);
      setCom_n(demandeur.com_n);
      setPrenom_p(demandeur.prenom_p);
      setPrenom_p_fr(demandeur.prenom_p_fr);
      setPrenom_m(demandeur.prenom_m);
      setPrenom_m_fr(demandeur.prenom_m_fr);
      setNom_m(demandeur.nom_m);
      setNom_m_fr(demandeur.nom_m_fr);
      setNum_i_n(demandeur.num_i_n);
      setStuation_f(demandeur.stuation_f);
      setSituation_p(demandeur.situation_p);
      setProfession(demandeur.profession);
      setSalaire(demandeur.salaire);
      setRemark(demandeur.remark);
    }
  }, [dispatch, demandeur]);

  useEffect(() => {
    dispatch(listWilayasAction());
  }, [dispatch]);

  useEffect(() => {
    dispatch(listCommunesByWilayaAction(wil_n));
  }, [dispatch, wil_n]);

  useEffect(() => {
    if (UpdatedDemandeur)
      dispatch(
        updateDossierAction(
          id,
          creator,
          UpdatedDemandeur?._id,
          null,
          date_depo,
          num_dos,
          null,
          null,
          null,
          null,
          null,
          type,
          gender_conj,
          remark,
          saisi_conj,
          null
        )
      );
  }, [
    dispatch,
    id,
    creator,
    date_depo,
    num_dos,
    type,
    gender_conj,
    remark,
    saisi_conj,
    UpdatedDemandeur,
  ]);

  useEffect(() => {
    if (UpdatedDossier) navigate("/dossiers");
  }, [navigate, UpdatedDossier]);

  const submitDemandeurHandler = (event) => {
    event.preventDefault();

    dispatch(
      updateDemandeurAction(
        dossier?.id_demandeur,
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
      {errordossierGet && (
        <ErrorMessage variant="danger">{errordossierGet}</ErrorMessage>
      )}
      {loadingdossierGet && <Loading />}

      {errordemandeurGet && (
        <ErrorMessage variant="danger">{errordemandeurGet}</ErrorMessage>
      )}
      {loadingdemandeurGet && <Loading />}

      {errorDossierUpdate && (
        <ErrorMessage variant="danger">{errorDossierUpdate}</ErrorMessage>
      )}
      {loadingDossierUpdate && <Loading />}

      {errordemandeurUpdate && (
        <ErrorMessage variant="danger">{errordemandeurUpdate}</ErrorMessage>
      )}
      {loadingdemandeurUpdate && <Loading />}

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
              value={prenom}
              onChange={(e) => setPrenom(e.target.value)}
            />
            <input
              value={prenom_fr}
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
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              type="text"
              id="nom"
              className="form-control text-right"
              name="nom"
              placeholder="اللقب"
            />
            <input
              value={nom_fr}
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
            <label>الجنس</label>
            {!gender || gender === "" ? (
              <div
                name="gender"
                onChange={(e) => {
                  setGender(e.target.value);
                  if (e.target.value === "m") setGender_conj("f");
                  else setGender_conj("m");
                }}
              >
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
            ) : gender === "m" ? (
              <label
                htmlFor="male"
                className="form-control text-right"
                onClick={() => setGender(null)}
              >
                ذكر
              </label>
            ) : gender === "f" ? (
              <div
                htmlFor="male"
                className="form-control text-right"
                onClick={() => setGender(null)}
              >
                أنثى
              </div>
            ) : null}

            <label htmlFor="num_act">رقم عقد الميلاد</label>
            <input
              value={num_act}
              onChange={(e) => setNum_act(e.target.value)}
              type="text"
              className="form-control text-right"
              name="num_act"
              required
            />
            <br />

            <label htmlFor="date_n">تاريخ الميلاد </label>
            <input
              value={date_n}
              onChange={(e) => setDate_n(e.target.value)}
              type="date"
              id="date_n"
              className="form-control text-right"
              name="date_n"
              required
            />
            <br />
          </div>
          <div className="col-sm order-sm-first">
            <label htmlFor="wil_n">ولاية الميلاد</label>
            {!wil_n || wil_n === "" ? (
              <select
                defaultValue={"-1"}
                onChange={(e) => setWil_n(e.target.value)}
                id="wil_n"
                className="form-control text-right"
                name="wil_n"
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
            ) : (
              wilayas?.map((wilaya) => {
                if (wilaya.code === wil_n)
                  return (
                    <div
                      key={wilaya._id}
                      className="form-control text-right"
                      onClick={() => setWil_n(null)}
                    >
                      {wilaya.nomAr}
                    </div>
                  );
                else return null;
              })
            )}

            <br />

            <label htmlFor="lieu_n">مكان الميلاد</label>
            <input
              value={lieu_n}
              onChange={(e) => setLieu_n(e.target.value)}
              type="text"
              id="lieu_n"
              className="form-control text-right"
              name="lieu_n"
              required
            />
            <input
              value={lieu_n_fr}
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
              value={com_n}
              onChange={(e) => setCom_n(e.target.value)}
              id="com_n"
              className="form-control text-right"
              name="com_n"
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
              value={prenom_p}
              onChange={(e) => setPrenom_p(e.target.value)}
              type="text"
              id="prenom_p"
              className="form-control text-right"
              name="prenom_p"
            />
            <input
              value={prenom_p_fr}
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
              value={prenom_m}
              onChange={(e) => setPrenom_m(e.target.value)}
              type="text"
              id="prenom_m"
              className="form-control text-right"
              name="prenom_m"
            />
            <input
              value={prenom_m_fr}
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
              value={nom_m}
              onChange={(e) => setNom_m(e.target.value)}
              type="text"
              id="nom_m"
              className="form-control text-right"
              name="nom_m"
            />
            <input
              value={nom_m_fr}
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
            value={num_i_n}
            onChange={(e) => setNum_i_n(e.target.value)}
            type="text"
            id="num_i_n"
            className="form-control text-right"
            name="num_i_n"
            required
          />

          <label>الوضعية المهنية</label>
          {situation_p === "chomeur" ? (
            <label
              className="form-control text-right"
              name="situation_p"
              onClick={() => setSituation_p("")}
            >
              بطال
            </label>
          ) : situation_p === "autre" ? (
            <div hidden={situation_p === "chomeur"}>
              <label
                className="form-control text-right"
                name="situation_p"
                onClick={() => setSituation_p("")}
              >
                اخرى
              </label>
              <label htmlFor="profession">المهنة</label>
              <br />
              <input
                className="form-control text-right"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                type="text"
                name="profession"
              />
              <br />
              <label htmlFor="salaire">الدخل</label>
              <br />
              <input
                className="form-control text-right"
                value={salaire}
                onChange={(e) => setSalaire(e.target.value)}
                type="text"
                name="salaire"
              />
              <br />
            </div>
          ) : situation_p === "autre" || !situation_p ? (
            <select
              className="form-control text-right"
              onChange={(e) => setSituation_p(e.target.value)}
              id="hide_situation_p"
              name="hide_situation_p"
            >
              <option name="situation_p" value="chomeur">
                بطال
              </option>
              <option name="situation_p" value="autre">
                أخر
              </option>
            </select>
          ) : null}

          <br />

          <label htmlFor="remark"> ملاحظات</label>
          <input
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            type="text"
            id="remark"
            className="form-control text-right"
            name="remark"
          />
        </div>
        <label>الحالة العائلية</label>
        {!stuation_f || stuation_f === "" ? (
          <div
            name="stuation_f"
            onChange={(e) => {
              setStuation_f(e.target.value);
              if (e.target.value === "m" && saisi_conj !== "true") setSaisi_conj("false");
            }}
            className="text-right"
          >
            <div className="intro"></div> <br />
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
        ) : stuation_f === "c" ? (
          <label
            htmlFor="cilib"
            className="form-control text-right"
            onClick={() => setStuation_f("")}
          >
            أعزب\عزباء{" "}
          </label>
        ) : stuation_f === "m" ? (
          <label
            htmlFor="marie"
            className="form-control text-right"
            onClick={() => setStuation_f("")}
          >
            متزوج\ة
          </label>
        ) : stuation_f === "d" ? (
          <label
            htmlFor="divor"
            className="form-control text-right"
            onClick={() => setStuation_f("")}
          >
            مطلق\ة
          </label>
        ) : stuation_f === "v" ? (
          <label
            htmlFor="veuf"
            className="form-control text-right"
            onClick={() => setStuation_f("")}
          >
            أرمل\ة
          </label>
        ) : null}

        <hr />
        <div className="col-sm order-sm-last">
          <label htmlFor="date_depo"> تاريخ الإيداع </label>
          <label
            type="date"
            id="date_depo"
            name="date_depo"
            className="form-control text-right"
            required
          >
            {date_depo}
          </label>
          <br />

          <label htmlFor="num_dos"> رقم الملف</label>
          <label
            type="text"
            id="num_dos"
            name="num_dos"
            className="form-control text-right"
            required
          >
            {num_dos}
          </label>
          <br />
        </div>
        <hr />
        <div className="row text-right">
          <div className="col-sm order-sm-last my-2">
            <Button type="submit" className="btn btn-lg btn-primary btn-block">
              حفظ
            </Button>
          </div>
          <div className="col-sm order-sm-first my-2">
            <Button
              onClick={() => navigate("/dossiers")}
              className="btn btn-lg btn-primary btn-block"
            >
              إلغاء
            </Button>
          </div>
        </div>
      </Form>
    </MainScreen>
  );
}

export default UpdateDemandeur;
