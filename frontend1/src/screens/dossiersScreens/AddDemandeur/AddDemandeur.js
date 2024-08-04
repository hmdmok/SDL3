import React, { useEffect } from "react";
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
import { useNavigate, useParams } from "react-router-dom";
import {
  addDossierAction,
  getDossierAction,
  updateDossierAction,
} from "../../../actions/dossierActions";
import { listCommunesByWilayaAction } from "../../../actions/communeActions";
import { listWilayasAction } from "../../../actions/wilayaActions";
import { convertDateFormat } from "../../../Functions/functions";
import { useForm } from "react-hook-form";
import MultiTextInput from "../../../Functions/MultiTextInput";
import TextInput from "../../../Functions/TextInput";
import SelectGroup from "../../../Functions/SelectGroup";

function AddDemandeur({ type }) {
  const form = useForm({
    defaultValues: {
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
      num_conj: 0,
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
    },
  });
  const {
    register,
    handleSubmit,
    formState,
    watch,
    getValues,
    setValue,
    reset,
    setError,
  } = form;
  const { errors, isSubmitting, dirtyFields } = formState;
  const { id, ordre } = useParams();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const backHandler = () => {
    navigate("/dossiers");
  };

  const situation_pItems = [
    { value: "chomeur", label: "بطال" },
    { value: "autre", label: "أخر" },
  ];
  const typeDateItems = [
    { value: "N", label: "عادي" },
    { value: "P", label: "مفترض" },
    { value: "B", label: "مكرر" },
  ];
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
    dispatch(listWilayasAction());
    if (id) dispatch(getDossierAction(id));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);

  useEffect(() => {
    console.log("get dossier", dossier);
    if (dossier) {
      setValue("date_depo", convertDateFormat(dossier.date_depo, "T").jsDate, {
        shouldValidate: true,
      });
      setValue("num_dos", dossier.num_dos, { shouldValidate: true });
      setValue("notes", dossier.notes, { shouldValidate: true });
      setValue("saisi_conj", dossier.saisi_conj, { shouldValidate: true });
      setValue("remark", dossier.remark, { shouldValidate: true });
      setValue("adress_fr", dossier.adress_fr, { shouldValidate: true });
      setValue("note_anciennete", dossier.note_anciennete, {
        shouldValidate: true,
      });
      setValue("note_situation_familiale", dossier.note_situation_familiale, {
        shouldValidate: true,
      });
      setValue("note_habita", dossier.note_habita, { shouldValidate: true });
      setValue("note_revenue", dossier.note_revenue, { shouldValidate: true });
      setValue("num_conj", dossier.num_conj, { shouldValidate: true });
      setValue("adress", dossier.adress, { shouldValidate: true });
      setValue("id_demandeur", dossier.id_demandeur);
      setValue("id_conjoin", dossier.id_conjoin);
      setValue("gender_conj", dossier.gender_conj);
      setValue("creator", userInfo.username);

      if (type === "dema") dispatch(getDemandeurAction(dossier?.id_demandeur));

      if (type === "conj")
        if (dossier?.id_conjoin[ordre])
          dispatch(getDemandeurAction(dossier?.id_conjoin[ordre]));
        else reset();
    }
    // Load the existing record for editing
    // Replace this with a specific action to fetch the record details if needed
  }, [dispatch, dossier, ordre, reset, setValue, type, userInfo.username]);

  useEffect(() => {
    console.log("get demandeur", success);
    if (demandeur) {
      setValue("photo_link", demandeur.photo_link, { shouldValidate: true });
      setValue("nom_fr", demandeur.nom_fr, { shouldValidate: true });
      setValue("nom", demandeur.nom, { shouldValidate: true });
      setValue("prenom_fr", demandeur.prenom_fr, { shouldValidate: true });
      setValue("prenom", demandeur.prenom, { shouldValidate: true });
      setValue("type_date_n", demandeur.type_date_n, { shouldValidate: true });
      setValue("num_act", demandeur.num_act, { shouldValidate: true });
      setValue("gender", demandeur.gender, { shouldValidate: true });
      setValue("date_n", convertDateFormat(demandeur.date_n, "T").jsDate, {
        shouldValidate: true,
      });
      setValue("com_n", demandeur.com_n, { shouldValidate: true });
      setValue("wil_n", demandeur.wil_n, { shouldValidate: true });
      setValue("lieu_n_fr", demandeur.lieu_n_fr, { shouldValidate: true });
      setValue("lieu_n", demandeur.lieu_n, { shouldValidate: true });
      setValue("salaire", demandeur.salaire, { shouldValidate: true });
      setValue("profession", demandeur.profession, { shouldValidate: true });
      setValue("situation_p", demandeur.situation_p, { shouldValidate: true });
      setValue("stuation_f", demandeur.stuation_f, { shouldValidate: true });
      setValue("num_i_n", demandeur.num_i_n, { shouldValidate: true });
      setValue("nom_m_fr", demandeur.nom_m_fr, { shouldValidate: true });
      setValue("nom_m", demandeur.nom_m, { shouldValidate: true });
      setValue("prenom_m_fr", demandeur.prenom_m_fr, { shouldValidate: true });
      setValue("prenom_m", demandeur.prenom_m, { shouldValidate: true });
      setValue("prenom_p_fr", demandeur.prenom_p_fr, { shouldValidate: true });
      setValue("prenom_p", demandeur.prenom_p, { shouldValidate: true });
    }
    // Load the existing record for editing
    // Replace this with a specific action to fetch the record details if needed
  }, [dispatch, demandeur, success, setValue]);

  useEffect(() => {
    console.log("add persone", addSuccess);
    console.log("update persone", updateSuccess);

    const subscribtion = watch((value) => {
      if (addSuccess) {
        if (type === "dema")
          dispatch(
            addDossierAction(
              value.creator,
              AddDemandeur._id,
              [],
              value.date_depo,
              value.num_dos,
              value.adress,
              value.num_conj,
              value.note_revenue,
              value.note_habita,
              value.note_situation_familiale,
              value.note_anciennete,
              "Saisi",
              value.adress_fr,
              value.remark,
              value.saisi_conj,
              null,
              value.notes
            )
          );
        else if (type === "conj") {
          const conjoin = dossier.id_conjoin;
          conjoin[ordre] = AddDemandeur._id;
          dispatch(
            updateDossierAction(
              id,
              value.creator,
              dossier.id_demandeur,
              conjoin,
              value.date_depo,
              value.num_dos,
              value.adress,
              value.num_conj,
              value.note_revenue,
              value.note_habita,
              value.note_situation_familiale,
              value.note_anciennete,
              "Saisi",
              value.adress_fr,
              value.remark,
              value.saisi_conj,
              null,
              value.notes
            )
          );
        }
      }
      if (updateSuccess) {
        if (id)
          dispatch(
            updateDossierAction(
              id,
              value.creator,
              null,
              null,
              value.date_depo,
              value.num_dos,
              value.adress,
              value.num_conj,
              value.note_revenue,
              value.note_habita,
              value.note_situation_familiale,
              value.note_anciennete,
              "Saisi",
              value.adress_fr,
              value.remark,
              value.saisi_conj,
              null,
              value.notes
            )
          );
      }
    });
    return () => {
      subscribtion.unsubscribe();
    };
  }, [
    AddDemandeur,
    addSuccess,
    dispatch,
    dossier,
    id,
    ordre,
    type,
    updateSuccess,
    watch,
  ]);

  useEffect(() => {
    if (successDossierUpdate) {
      console.log("update dossier", successDossierUpdate);
      reset();
      try {
        navigate(`/dossiers`);
      } catch (error) {
        setError("root", {
          type: "manual",
          message: error.message,
        });
      }
    }
  }, [navigate, reset, setError, successDossierUpdate]);

  useEffect(() => {
    console.log("add dossier", successDossierAdd);
    try {
      if (successDossierAdd) {
        reset();
        navigate(`/dossiers`);
      }
    } catch (error) {
      setError("root", {
        type: "manual",
        message: error.message,
      });
    }
  }, [navigate, reset, setError, successDossierAdd]);

  useEffect(() => {
    const subscription = watch((value) => {
      console.log("set willaya", dirtyFields?.wil_n);
      if (dirtyFields?.wil_n)
        dispatch(listCommunesByWilayaAction(getValues("wil_n")));
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [dirtyFields, dispatch, getValues, watch]);
  const submitHandler = async (data) => {
    console.log(data);
    try {
      if (id) {
        if (type === "dema")
          dispatch(updateDemandeurAction(dossier.id_demandeur, data));
        if (type === "conj")
          if (dossier.id_conjoin[ordre])
            dispatch(updateDemandeurAction(dossier.id_conjoin[ordre], data));
          else dispatch(addDemandeurAction(data));
      } else {
        dispatch(addDemandeurAction(data));
      }
    } catch (error) {
      setError("root", {
        type: "manual",
        message: error.message,
      });
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

      <MainScreen
        title={`ادخال معلومات ${type === "dema" ? " طالب السكن" : " الزوجة"} ${
          ordre ? ordre + 1 : ""
        }`}
      >
        <Form
          onSubmit={handleSubmit(submitHandler)}
          noValidate
          className="container"
        >
          <Row className="text-right">
            <Col sm={{ order: "last" }}>
              <MultiTextInput
                errors={errors}
                label={"الاسم"}
                others={register}
                name={"prenom"}
              />
              <br />
            </Col>
            <Col sm={{ order: "first" }}>
              <MultiTextInput
                errors={errors}
                label={"اللقب"}
                others={register}
                name={"nom"}
              />
              <br />
            </Col>
          </Row>
          <Row className="text-right">
            <Col sm={{ order: "last" }}>
              <RadioGroup
                errors={errors}
                label={"الجنس"}
                name={"gender"}
                items={genderItems}
                onChange={register}
              />
              <TextInput
                errors={errors}
                label={"رقم عقد الميلاد"}
                others={register}
                name={"num_act"}
                type={"text"}
              />
              <br />
              <TextInput
                errors={errors}
                label={"تاريخ الميلاد "}
                others={register}
                name={"date_n"}
                type={"date"}
              />
              <SelectGroup
                errors={errors}
                label={"طبيعة تاريخ الميلاد"}
                name={"type_date_n"}
                items={typeDateItems}
                others={register}
              />

              <br />
            </Col>
            <Col sm={{ order: "first" }}>
              <SelectGroup
                errors={errors}
                label={"ولاية الميلاد"}
                name={"wil_n"}
                others={register}
                items={wilayas?.map((wilaya) => ({
                  value: wilaya.code,
                  label: wilaya.nomAr,
                }))}
              />
              <br />
              <SelectGroup
                errors={errors}
                items={communes?.map((commune) => ({
                  value: commune.nomFr,
                  label: commune.nomAr,
                }))}
                name={"com_n"}
                label={"بلدية الميلاد"}
                others={register}
              />
              <br />
              <MultiTextInput
                errors={errors}
                label={"مكان الميلاد"}
                others={register}
                name={"lieu_n"}
              />
              <br />
            </Col>
          </Row>
          <Row className="text-right">
            <Col sm={{ order: "last" }}>
              <MultiTextInput
                errors={errors}
                label={"اسم الاب"}
                name={"prenom_p"}
                others={register}
              />
              <br />
              <MultiTextInput
                errors={errors}
                label={"اسم الأم"}
                others={register}
                name={"prenom_m"}
              />
              <br />
            </Col>
            <Col sm={{ order: "first" }}>
              <TextInput
                errors={errors}
                label={"رقم التعريف الوطني"}
                name={"num_i_n"}
                others={register}
                type={"text"}
              />
              <br />
              <MultiTextInput
                errors={errors}
                label={"لقب الأم"}
                others={register}
                name={"nom_m"}
              />
              <br />
            </Col>
          </Row>
          <Row className="text-right">
            <Col sm={{ order: "last" }}>
              <SelectGroup
                errors={errors}
                items={situation_pItems}
                label={"الوضعية المهنية"}
                name={"situation_p"}
                others={register}
              />
              <br />

              <MultiTextInput
                errors={errors}
                label={"المهنة"}
                others={register}
                name={"profession"}
              />
              <br />

              <TextInput
                errors={errors}
                label={"الدخل"}
                name={"salaire"}
                others={register}
                type={"text"}
              />
              <br />
            </Col>
            <Col sm={{ order: "first" }}>
              <RadioGroup
                errors={errors}
                label={"الحالة العائلية"}
                name={"stuation_f"}
                items={stuation_fItems}
                onChange={register}
              />
              <br />

              <TextInput
                errors={errors}
                label={"عدد الزوجات"}
                name={"num_conj"}
                others={register}
                type={"text"}
              />
              <br />

              <MultiTextInput
                errors={errors}
                label={"العنوان"}
                name={"adress"}
                others={register}
              />
              <br />
            </Col>
          </Row>
          <hr />
          <Row className="text-right">
            <Col sm={{ order: "last" }}>
              <TextInput
                errors={errors}
                label={"رقم الملف"}
                name={"num_dos"}
                others={register}
                type={"text"}
              />
              <br />
            </Col>
            <Col>
              <TextInput
                errors={errors}
                label={"تاريخ الإيداع"}
                name={"date_depo"}
                others={register}
                type={"date"}
              />
              <br />
            </Col>
            <Col sm={{ order: "first" }}>
              <TextInput
                errors={errors}
                label={"مجموع النقاط"}
                name={"notes"}
                others={register}
                type={"text"}
              />
              <br />
            </Col>
          </Row>
          <Row className="text-right">
            <Col sm={{ order: "last" }}>
              <TextInput
                errors={errors}
                label={"نقاط أقدمية طلب السكن"}
                name={"note_anciennete"}
                others={register}
                type={"text"}
              />
              <br />
            </Col>
            <Col sm={{ order: "first" }}>
              <TextInput
                errors={errors}
                label={"نقاط مستوى المداخيل"}
                name={"note_revenue"}
                others={register}
                type={"text"}
              />
              <br />
            </Col>
            <Col>
              <TextInput
                errors={errors}
                label={"نقاط ظروف السكن"}
                name={"note_habita"}
                others={register}
                type={"text"}
              />
              <br />
            </Col>
          </Row>
          <Row className="text-right">
            <Col sm={{ order: "last" }}>
              <TextInput
                errors={errors}
                label={"نقاط الحالة العائلية"}
                name={"note_situation_familiale"}
                others={register}
                type={"text"}
              />
              <br />
            </Col>
            <Col sm={{ order: "first" }}>
              <TextInput
                errors={errors}
                label={"ملاحظات"}
                name={"remark"}
                others={register}
                type={"text"}
              />
              <br />
            </Col>
          </Row>
          <Row className="text-right">
            {type === "dema" &&
              [...Array(getValues("num_conj"))].map((_, i) =>
                dossier?.id_conjoin[i] ? (
                  <Button
                    className="col-sm m-2"
                    key={i + i}
                    href={`/conjoin/${id}/${i}`}
                  >
                    تعديل معلومات الزوجة {i + 1}
                  </Button>
                ) : (
                  <Button
                    className="col-sm m-2"
                    key={i + i}
                    href={`/conjoin/${id}/${i}`}
                  >
                    اظافة معلومات الزوجة {i + 1}
                  </Button>
                )
              )}
            {type === "conj" && (
              <Button className="col-sm m-2" href={`/adddossiers/${id}`}>
                تعديل معلومات طالب السكن
              </Button>
            )}
          </Row>
          <hr />
          <Row className="text-right">
            <Button type="submit" className="col-sm order-sm-last m-2">
              {isSubmitting ||
              addLoading ||
              updateLoading ||
              loadingDossierAdd ||
              loadingDossierUpdate
                ? "جاري"
                : "حفظ"}
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
          {errors["root"] && (
            <p className="text-danger text-right">{errors["root"].message}</p>
          )}
        </Form>
      </MainScreen>
    </>
  );
}

export default AddDemandeur;
