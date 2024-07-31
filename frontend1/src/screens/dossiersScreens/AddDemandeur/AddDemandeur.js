import React, { useEffect, useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  addDemandeurAction,
  getDemandeurAction,
  updateDemandeurAction,
} from "../../../actions/demandeurActions";
import ErrorMessage from "../../../components/ErrorMessage";
import Loading from "../../../components/Loading";
import MainScreen from "../../../components/MainScreen/MainScreen";
import RadioGroup from "../../../Functions/RadioGroup";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  addDossierAction,
  getDossierAction,
  updateDossierAction,
} from "../../../actions/dossierActions";
import { listCommunesByWilayaAction } from "../../../actions/communeActions";
import { listWilayasAction } from "../../../actions/wilayaActions";
import { convertDateFormat } from "../../../Functions/functions";

function AddDemandeur({ type }) {
  const [formData, setFormData] = useState({
    prenom: "",
    prenom_fr: "",
    nom: "",
    nom_fr: "",
    gender: "",
    num_act: "",
    date_n: "",
    type_date_n: "N",
    lieu_n: "",
    lieu_n_fr: "",
    wil_n: -1,
    com_n: -1,
    prenom_p: "",
    prenom_p_fr: "",
    prenom_m: "",
    prenom_m_fr: "",
    nom_m: "",
    nom_m_fr: "",
    num_i_n: "",
    stuation_f: "",
    situation_p: "chomeur",
    profession: "",
    salaire: "",
    creator: "",
    remark: "",
    num_conj: 1,
    date_depo: "",
    num_dos: "",
    saisi_conj: "",
    adress: "",
    adress_fr: "",
    note_revenue: 0,
    note_habita: 0,
    note_situation_familiale: 0,
    note_anciennete: 0,
    notes: 0,
    type: type,
  });

  const {
    prenom,
    prenom_fr,
    nom,
    nom_fr,
    gender,
    num_act,
    date_n,
    type_date_n,
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
    situation_p,
    profession,
    salaire,
    creator,
    remark,
    num_conj,
    date_depo,
    num_dos,
    saisi_conj,
    adress,
    adress_fr,
    note_revenue,
    note_habita,
    note_situation_familiale,
    note_anciennete,
    notes,
  } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const backHandler = () => {
    // navigate("/dossiers");
  };

  const genderItems = [
    { value: "M", label: "ذكر" },
    { value: "F", label: "أنثى" },
  ];
  const stuation_fItems = [
    { value: "C", label: "أعزب/عزباء" },
    { value: "M", label: "متزوج(ة)" },
    { value: "D", label: "مطلق(ة)" },
    { value: "V", label: "أرمل(ة)" },
  ];

  const { id, ordre } = useParams();

  const { loading, demandeur, success, error } = useSelector(
    (state) => state.demandeurGet
  );
  const {
    loading: addLoading,
    demandeur: AddDemandeur,
    success: addSuccess,
    error: addError,
  } = useSelector((state) => state.demandeurAdd);
  const {
    loading: updateLoading,
    demandeur: UpdateDemandeur,
    success: updateSuccess,
    error: updateError,
  } = useSelector((state) => state.demandeurUpdate);
  const { loading: loadingWilayas, wilayas } = useSelector(
    (state) => state.wilayaList
  );
  const { loading: loadingCommunes, communes } = useSelector(
    (state) => state.communeGetByWilaya
  );
  const {
    loading: loadingDossier,
    dossier,
    error: errorDossier,
  } = useSelector((state) => state.dossierGet);
  const {
    loading: loadingDossierAdd,
    success: successDossierAdd,
    error: errorDossierAdd,
  } = useSelector((state) => state.dossierAdd);
  const {
    loading: loadingDossierUpdate,
    success: successDossierUpdate,
    error: errorDossierUpdate,
  } = useSelector((state) => state.dossierUpdate);
  const { userInfo } = useSelector((state) => state.userLogin);

  useEffect(() => {
    setFormData((prevState) => ({ ...prevState, creator: userInfo.username }));
    dispatch(listWilayasAction());
    if (id) dispatch(getDossierAction(id));
    // console.log(id);
  }, [dispatch, userInfo, id]);

  useEffect(() => {
    if (dossier) {
      setFormData((prevState) => ({
        ...prevState,
        date_depo: dossier.date_depo || "",
        num_dos: dossier.num_dos || "",
        adress: dossier.adress || "",
        num_conj: dossier.num_conj || "0",
        note_revenue: dossier.note_revenue || "0",
        note_habita: dossier.note_habita || "0",
        note_situation_familiale: dossier.note_situation_familiale || "0",
        note_anciennete: dossier.note_anciennete || "0",
        adress_fr: dossier.adress_fr || "",
        remark: dossier.remark || "",
        saisi_conj: dossier.saisi_conj || "",
        notes: dossier.notes || "0",
      }));
      if (type === "dema") dispatch(getDemandeurAction(dossier?.id_demandeur));

      if (type === "conj")
        if (dossier?.id_conjoin[ordre])
          dispatch(getDemandeurAction(dossier?.id_conjoin[ordre]));
        else
          setFormData((prevState) => ({
            ...prevState,
            prenom: "",
            prenom_fr: "",
            nom: "",
            nom_fr: "",
            gender: dossier?.gender_conj,
            num_act: "",
            type_date_n: "",
            date_n: "",
            lieu_n: "",
            lieu_n_fr: "",
            wil_n: "",
            com_n: "",
            prenom_p: "",
            prenom_p_fr: "",
            prenom_m: "",
            prenom_m_fr: "",
            nom_m: "",
            nom_m_fr: "",
            num_i_n: "",
            stuation_f: "M",
            situation_p: "chomeur",
            profession: "",
            salaire: "",
            photo_link: "",
          }));

      // console.log(dossier?.gender_conj);
    }
    // Load the existing record for editing
    // Replace this with a specific action to fetch the record details if needed
  }, [dispatch, dossier, ordre, type]);

  useEffect(() => {
    if (demandeur) {
      setFormData((prevState) => ({
        ...prevState,
        prenom: demandeur.prenom || "",
        prenom_fr: demandeur.prenom_fr || "",
        nom: demandeur.nom || "",
        nom_fr: demandeur.nom_fr || "",
        gender: demandeur.gender || "",
        num_act: demandeur.num_act || "",
        type_date_n: demandeur.type_date_n || "",
        date_n: demandeur.date_n || "",
        lieu_n: demandeur.lieu_n || "",
        lieu_n_fr: demandeur.lieu_n_fr || "",
        wil_n: demandeur.wil_n || "",
        com_n: demandeur.com_n || "",
        prenom_p: demandeur.prenom_p || "",
        prenom_p_fr: demandeur.prenom_p_fr || "",
        prenom_m: demandeur.prenom_m || "",
        prenom_m_fr: demandeur.prenom_m_fr || "",
        nom_m: demandeur.nom_m || "",
        nom_m_fr: demandeur.nom_m_fr || "",
        num_i_n: demandeur.num_i_n || "",
        stuation_f: demandeur.stuation_f || "",
        situation_p: demandeur.situation_p || "",
        profession: demandeur.profession || "",
        salaire: demandeur.salaire || "",
        photo_link: demandeur.photo_link || "",
      }));

      // console.log("demandeur:", demandeur.gender);
    }
    // Load the existing record for editing
    // Replace this with a specific action to fetch the record details if needed
  }, [dispatch, demandeur, success]);

  useEffect(() => {
    if (wil_n) dispatch(listCommunesByWilayaAction(wil_n));
  }, [dispatch, wil_n]);

  useEffect(() => {
    if (addSuccess)
      if (type === "dema")
        dispatch(
          addDossierAction(
            creator,
            AddDemandeur._id,
            [],
            date_depo,
            num_dos,
            adress,
            num_conj,
            note_revenue,
            note_habita,
            note_situation_familiale,
            note_anciennete,
            "Saisi",
            adress_fr,
            remark,
            saisi_conj,
            null,
            notes
          )
        );
      else if (type === "conj") {
        const conjoin = dossier.id_conjoin;
        conjoin[ordre] = AddDemandeur._id;
        dispatch(
          updateDossierAction(
            id,
            creator,
            dossier.id_demandeur,
            conjoin,
            date_depo,
            num_dos,
            adress,
            num_conj,
            note_revenue,
            note_habita,
            note_situation_familiale,
            note_anciennete,
            "Saisi",
            adress_fr,
            remark,
            saisi_conj,
            null,
            notes
          )
        );
      }
    if (updateSuccess) {
      if (id)
        dispatch(
          updateDossierAction(
            id,
            creator,
            UpdateDemandeur._id,
            [],
            date_depo,
            num_dos,
            adress,
            num_conj,
            note_revenue,
            note_habita,
            note_situation_familiale,
            note_anciennete,
            "Saisi",
            adress_fr,
            remark,
            saisi_conj,
            null,
            notes
          )
        );
    }
  }, [
    dispatch,
    id,
    addSuccess,
    updateSuccess,
    creator,
    AddDemandeur,
    UpdateDemandeur,
    date_depo,
    num_dos,
    adress,
    num_conj,
    note_revenue,
    note_habita,
    note_situation_familiale,
    note_anciennete,
    adress_fr,
    remark,
    saisi_conj,
    notes,
  ]);
  useEffect(() => {
    if (successDossierAdd || successDossierUpdate)
      console.log(
        "dossier:" +
          dossier +
          " ,successDossierAdd:" +
          successDossierAdd +
          " ,successDossierUpdate:" +
          successDossierUpdate
      );
    // navigate(`/dossiers`);
  }, [navigate, successDossierAdd, successDossierUpdate]);
  const handleChange = (e) => {
    // console.log(e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (id) {
      if (type === "dema")
        dispatch(updateDemandeurAction(dossier.id_demandeur, formData));
      if (type === "conj")
        if (dossier.id_conjoin[ordre])
          dispatch(updateDemandeurAction(dossier.id_conjoin[ordre], formData));
        else dispatch(addDemandeurAction(formData));
    } else {
      dispatch(addDemandeurAction(formData));
    }
  };

  return (
    <>
      {error && <ErrorMessage variant="danger">{error}</ErrorMessage>}
      {addError && <ErrorMessage variant="danger">{addError}</ErrorMessage>}
      {errorDossierUpdate && (
        <ErrorMessage variant="danger">{errorDossierUpdate}</ErrorMessage>
      )}
      {errorDossierAdd && (
        <ErrorMessage variant="danger">{errorDossierAdd}</ErrorMessage>
      )}
      {updateError && (
        <ErrorMessage variant="danger">{updateError}</ErrorMessage>
      )}
      {errorDossier && (
        <ErrorMessage variant="danger">{errorDossier}</ErrorMessage>
      )}
      {loading && <Loading />}
      {loadingDossierAdd && <Loading />}
      {loadingDossierUpdate && <Loading />}
      {addLoading && <Loading />}
      {updateLoading && <Loading />}
      {loadingWilayas && <Loading />}
      {loadingCommunes && <Loading />}
      {loadingDossier && <Loading />}

      <MainScreen title={"ادخال معلومات طالب السكن"}>
        <Form onSubmit={submitHandler} className="container">
          <Row className="text-right">
            <Col sm={{ order: "last" }}>
              <label htmlFor="prenom">الاسم</label>
              <input
                type="text"
                id="prenom"
                className="form-control text-right"
                name="prenom"
                placeholder="الاسم"
                value={prenom || ""}
                onChange={handleChange}
              />
              <input
                value={prenom_fr || ""}
                onChange={handleChange}
                type="text"
                id="prenom_fr"
                name="prenom_fr"
                className="form-control text-right"
                placeholder="الاسم باللاتينية"
              />
              <br />
            </Col>
            <Col sm={{ order: "first" }}>
              <label htmlFor="nom">اللقب</label>
              <input
                value={nom || ""}
                onChange={handleChange}
                type="text"
                id="nom"
                className="form-control text-right"
                name="nom"
                placeholder="اللقب"
              />
              <input
                value={nom_fr || ""}
                onChange={handleChange}
                type="text"
                id="nom_fr"
                name="nom_fr"
                className="form-control text-right"
                placeholder="اللقب باللاتينية"
              />
              <br />
            </Col>
          </Row>
          <Row className="text-right">
            <Col sm={{ order: "last" }}>
              <label>الجنس</label>
              <br />
              <RadioGroup
                name={"gender"}
                items={genderItems}
                value={gender || ""}
                onChange={handleChange}
                desabled={type === "conj"}
              />

              <label htmlFor="num_act">رقم عقد الميلاد</label>
              <input
                value={num_act || ""}
                onChange={handleChange}
                type="text"
                className="form-control text-right"
                name="num_act"
                required
              />
              <br />

              <label htmlFor="date_n">تاريخ الميلاد </label>
              <input
                value={convertDateFormat(date_n, "T").jsDate || ""}
                onChange={handleChange}
                type="date"
                id="date_n"
                className="form-control text-right"
                name="date_n"
                required
              />
              <label htmlFor="type_date_n">طبيعة تاريخ الميلاد</label>
              <select
                className="form-control text-right"
                onChange={handleChange}
                value={type_date_n}
                id="type_date_n"
                name="type_date_n"
                required
              >
                <option name="type_date_n" value="N">
                  عادي
                </option>
                <option name="type_date_n" value="P">
                  مفترض
                </option>
                <option name="type_date_n" value="B">
                  مكرر
                </option>
              </select>
              <br />
            </Col>
            <Col sm={{ order: "first" }}>
              <label htmlFor="wil_n">ولاية الميلاد</label>
              <select
                value={wil_n || ""}
                onChange={handleChange}
                id="wil_n"
                className="form-control text-right"
                name="wil_n"
                required
              >
                <option value="-1" disabled hidden>
                  اختر ولاية الميلاد
                </option>
                {wilayas?.map((wilaya) => (
                  <option key={wilaya._id} value={wilaya.nomFr || ""}>
                    {wilaya.nomAr}
                  </option>
                ))}
              </select>
              <br />

              <label htmlFor="lieu_n">مكان الميلاد</label>
              <input
                value={lieu_n || ""}
                onChange={handleChange}
                type="text"
                id="lieu_n"
                className="form-control text-right"
                name="lieu_n"
              />
              <input
                value={lieu_n_fr || ""}
                onChange={handleChange}
                type="text"
                id="lieu_n_fr"
                className="form-control text-right"
                name="lieu_n_fr"
                placeholder="مكان الميلاد باللاتينية"
              />
              <br />

              <label htmlFor="com_n">بلدية الميلاد</label>
              <select
                value={com_n || ""}
                onChange={handleChange}
                id="com_n"
                className="form-control text-right"
                name="com_n"
                required
              >
                <option value="-1" disabled hidden>
                  اختر بلدية الميلاد
                </option>
                {communes?.map((commune) => (
                  <option key={commune._id} value={commune.nomFr || ""}>
                    {commune.nomAr}
                  </option>
                ))}
              </select>
              <br />

              <label htmlFor="prenom_p"> اسم الاب</label>
              <input
                value={prenom_p || ""}
                onChange={handleChange}
                type="text"
                id="prenom_p"
                className="form-control text-right"
                name="prenom_p"
              />
              <input
                value={prenom_p_fr || ""}
                onChange={handleChange}
                type="text"
                id="prenom_p_fr"
                className="form-control text-right"
                name="prenom_p_fr"
                placeholder="اسم الاب باللاتينية"
              />
              <br />
            </Col>
          </Row>
          <Row className="text-right">
            <Col sm={{ order: "last" }}>
              <label htmlFor="prenom_m"> اسم الأم</label>
              <input
                value={prenom_m || ""}
                onChange={handleChange}
                type="text"
                id="prenom_m"
                className="form-control text-right"
                name="prenom_m"
              />
              <input
                value={prenom_m_fr || ""}
                onChange={handleChange}
                type="text"
                id="prenom_m_fr"
                className="form-control text-right"
                name="prenom_m_fr"
                placeholder="اسم الأم باللاتينية"
              />
              <br />
            </Col>
            <Col sm={{ order: "first" }}>
              <label htmlFor="nom_m">لقب الأم</label>
              <input
                value={nom_m || ""}
                onChange={handleChange}
                type="text"
                id="nom_m"
                className="form-control text-right"
                name="nom_m"
              />
              <input
                value={nom_m_fr || ""}
                onChange={handleChange}
                type="text"
                id="nom_m_fr"
                className="form-control text-right"
                name="nom_m_fr"
                placeholder="لقب الأم باللاتينية"
              />
              <br />
            </Col>
          </Row>
          <Row className="text-right">
            <Col sm={{ order: "last" }}>
              <label htmlFor="num_i_n"> رقم التعريف الوطني</label>
              <input
                value={num_i_n || ""}
                onChange={handleChange}
                type="text"
                id="num_i_n"
                className="form-control text-right"
                name="num_i_n"
              />

              <label>الوضعية المهنية</label>
              <br />
              <select
                className="form-control text-right"
                value={situation_p || ""}
                onChange={handleChange}
                id="hide_situation_p"
                name="situation_p"
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
                  value={profession || ""}
                  onChange={handleChange}
                  type="text"
                  name="profession"
                />
                <br />
                <label htmlFor="salaire">الدخل</label>
                <br />
                <input
                  className="form-control text-right"
                  value={salaire || ""}
                  onChange={handleChange}
                  type="text"
                  name="salaire"
                />
                <br />
              </div>

              <label htmlFor="remark"> ملاحظات</label>
              <input
                value={remark || ""}
                onChange={handleChange}
                type="text"
                id="remark"
                className="form-control text-right"
                name="remark"
              />
            </Col>
            <Col sm={{ order: "first" }}>
              <label>الحالة العائلية</label>
              <RadioGroup
                name={"stuation_f"}
                items={stuation_fItems || ""}
                onChange={handleChange}
                value={stuation_f}
                desabled={type === "conj"}
              />
              <br />
              {stuation_f === "M" && gender === "M" && (
                <>
                  <label htmlFor="num_conj">عدد الزوجات</label>
                  <input
                    onChange={handleChange}
                    type="text"
                    id="num_conj"
                    className="form-control text-right"
                    name="num_conj"
                    value={num_conj || ""}
                  />
                </>
              )}
            </Col>
          </Row>
          <Col className="col-sm order-sm-last  text-right">
            <label htmlFor="adress">العنوان</label>
            <input
              type="text"
              id="adress"
              className="form-control text-right"
              name="adress"
              placeholder="العنوان"
              onChange={handleChange}
              value={adress || ""}
            />
            <input
              value={adress_fr || ""}
              onChange={handleChange}
              type="text"
              id="adress_fr"
              name="adress_fr"
              className="form-control text-right"
              placeholder="العنوان باللاتينية"
            />
            <br />
          </Col>
          <hr />
          <Row className="text-right">
            <Col sm={{ order: "last" }}>
              <label htmlFor="date_depo"> تاريخ الإيداع </label>
              <input
                type="date"
                id="date_depo"
                name="date_depo"
                className="form-control text-right"
                onChange={handleChange}
                value={convertDateFormat(date_depo, "T").jsDate || ""}
                required
              />
              <br />
            </Col>
            <Col sm={{ order: "last" }}>
              <label htmlFor="num_dos"> رقم الملف</label>
              <input
                type="text"
                id="num_dos"
                name="num_dos"
                className="form-control text-right"
                onChange={handleChange}
                value={num_dos || ""}
                required
              />
              <br />
            </Col>
          </Row>
          <Row className="text-right">
            <Col sm={{ order: "last" }}>
              <label htmlFor="note_revenue">مستوى المداخيل</label>
              <input
                type="text"
                id="note_revenue"
                name="note_revenue"
                className="form-control text-right"
                onChange={handleChange}
                value={note_revenue || ""}
                required
              />
              <br />
            </Col>
            <Col sm={{ order: "last" }}>
              <label htmlFor="note_habita">ظروف السكن</label>
              <input
                type="text"
                id="note_habita"
                name="note_habita"
                className="form-control text-right"
                onChange={handleChange}
                value={note_habita || ""}
                required
              />
              <br />
            </Col>
          </Row>
          <Row className="text-right">
            <Col sm={{ order: "last" }}>
              <label htmlFor="note_situation_familiale">الحالة العائلية</label>
              <input
                type="text"
                id="note_situation_familiale"
                name="note_situation_familiale"
                className="form-control text-right"
                onChange={handleChange}
                value={note_situation_familiale || ""}
                required
              />
              <br />
            </Col>
            <Col sm={{ order: "last" }}>
              <label htmlFor="notes">أقدمية طلب السكن</label>
              <input
                type="text"
                id="notes"
                name="notes"
                className="form-control text-right"
                onChange={handleChange}
                value={notes || ""}
                required
              />
              <br />
            </Col>{" "}
            <Col sm={{ order: "last" }}>
              <label htmlFor="note_anciennete">مجموع النقاط</label>
              <input
                type="text"
                id="note_anciennete"
                name="note_anciennete"
                className="form-control text-right"
                onChange={handleChange}
                value={note_anciennete || ""}
                required
              />
              <br />
            </Col>
          </Row>
          <Row className="text-right">
            {type === "dema" &&
              [...Array(num_conj)].map((_, i) =>
                dossier?.id_conjoin[i] ? (
                  <Button className="col-sm m-2" key={i + i}>
                    <Link to={`/conjoin/${id}/${i}`}>
                      تعديل معلومات الزوجة {i + 1}
                    </Link>
                  </Button>
                ) : (
                  <Button className="col-sm m-2" key={i + i}>
                    <Link to={`/conjoin/${id}/${i}`}>
                      اظافة معلومات الزوجة {i + 1}
                    </Link>
                  </Button>
                )
              )}
            {type === "conj" && (
              <Button className="col-sm m-2">
                <Link to={`/adddossiers/${id}`}>تعديل معلومات طالب السكن</Link>
              </Button>
            )}
          </Row>
          <hr />
          <Row className="text-right">
            <Button type="submit" className="col-sm order-sm-last m-2">
              {"حفظ"}
            </Button>
            <Button type="reset" className="col-sm order-sm-first m-2">
              {"إلغاء"}
            </Button>
            <Button
              className="col-sm order-sm-first m-2"
              onClick={() => backHandler()}
            >
              {"الرجوع"}
            </Button>
          </Row>
        </Form>
      </MainScreen>
    </>
  );
}

export default AddDemandeur;
