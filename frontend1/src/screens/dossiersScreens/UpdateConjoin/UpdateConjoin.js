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

function Conjoin() {
  const { id } = useParams();
  let navigate = useNavigate();

  const [prenom, setPrenom] = useState("");
  const [prenom_fr, setPrenom_fr] = useState("");
  const [nom, setNom] = useState("");
  const [nom_fr, setNom_fr] = useState("");

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

  const [situation_p, setSituation_p] = useState("chomeur");
  const [profession, setProfession] = useState("");
  const [salaire, setSalaire] = useState("");
  const [creator, setCreator] = useState("");
  const [remark, setRemark] = useState("");

  const [date_depo, setDate_depo] = useState("");
  const [num_dos, setNum_dos] = useState("");

  const dispatch = useDispatch();

  const demandeurGet = useSelector((state) => state.demandeurGet);
  const {
    loading: loadingdemandeurGet,
    demandeur: getConjoin,
    error: errordemandeurGet,
  } = demandeurGet;

  const dossierGet = useSelector((state) => state.dossierGet);
  const {
    loading: loadingdossierGet,
    dossier: getDossier,
    error: errordossierGet,
  } = dossierGet;

  const demandeurUpdate = useSelector((state) => state.demandeurUpdate);
  const {
    loading: loadingdemandeurUpdate,
    demandeur: UpdatedConjoin,
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
    if (getDossier) {
      dispatch(getDemandeurAction(getDossier?.id_conjoin));
      setDate_depo(getDossier?.date_depo);
      setNum_dos(getDossier?.num_dos);
    }
  }, [dispatch, getDossier]);

  useEffect(() => {
    if (getConjoin) {
      setPrenom(getConjoin.prenom);
      setPrenom_fr(getConjoin.prenom_fr);
      setNom(getConjoin.nom);
      setNom_fr(getConjoin.nom_fr);

      setNum_act(getConjoin.num_act);
      setDate_n(getConjoin.date_n);
      setLieu_n(getConjoin.lieu_n);
      setLieu_n_fr(getConjoin.lieu_n_fr);
      setWil_n(getConjoin.wil_n);
      setCom_n(getConjoin.com_n);
      setPrenom_p(getConjoin.prenom_p);
      setPrenom_p_fr(getConjoin.prenom_p_fr);
      setPrenom_m(getConjoin.prenom_m);
      setPrenom_m_fr(getConjoin.prenom_m_fr);
      setNom_m(getConjoin.nom_m);
      setNom_m_fr(getConjoin.nom_m_fr);
      setNum_i_n(getConjoin.num_i_n);

      setSituation_p(getConjoin.situation_p);
      setProfession(getConjoin.profession);
      setSalaire(getConjoin.salaire);
      setRemark(getConjoin.remark);
    }
  }, [dispatch, getConjoin]);

  useEffect(() => {
    dispatch(listWilayasAction());
  }, [dispatch]);

  useEffect(() => {
    dispatch(listCommunesByWilayaAction(wil_n));
  }, [dispatch, wil_n]);

  useEffect(() => {
    if (UpdatedConjoin)
      dispatch(
        updateDossierAction(
          id,
          creator,
          null,
          UpdatedConjoin?._id,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          remark,
          null,
          null
        )
      );
  }, [dispatch, id, creator, remark, UpdatedConjoin]);

  useEffect(() => {
    if (UpdatedDossier) navigate("/dossiers");
  }, [navigate, UpdatedDossier]);

  const submitDemandeurHandler = (event) => {
    event.preventDefault();

    dispatch(
      updateDemandeurAction(
        getDossier?.id_conjoin,
        prenom,
        prenom_fr,
        nom,
        nom_fr,
        null,
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
        null,
        null,
        situation_p,
        profession,
        salaire,
        creator,
        remark
      )
    );
  };

  return (
    <MainScreen title={"تعديل معلومات  الزوج(ة)"}>
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

export default Conjoin;
