import React from "react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { getDemandeurAction } from "../../../actions/demandeurActions";
import {
  getDossierAction,
  updateDossierAction,
} from "../../../actions/dossierActions";
import ErrorMessage from "../../../components/ErrorMessage";
import Loading from "../../../components/Loading";
import MainScreen from "../../../components/MainScreen/MainScreen";
import { convertDateFormat } from "../../../Functions/functions";

function UpdateDossiers() {
  const [num_conj, setNum_conj] = useState(0);
  const [num_enf, setNum_enf] = useState("0");
  const [stuation_s_avec_d, setStuation_s_avec_d] = useState(false);
  const [stuation_s_andicap, setStuation_s_andicap] = useState(false);
  const [numb_p, setNumb_p] = useState("0");
  const [remark, setRemark] = useState("");
  const [creator, setCreator] = useState("");
  const [adress, setAdress] = useState("");
  const [date_depo, setDate_depo] = useState("");

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  let { id } = useParams();
  let navigate = useNavigate();

  const dispatch = useDispatch();

  const demandeurGet = useSelector((state) => state.demandeurGet);
  const {
    loading: loadingDemandeurGet,
    demandeur,
    error: errorDemandeurGet,
  } = demandeurGet;

  const dossierGet = useSelector((state) => state.dossierGet);
  const {
    loading: loadingDossierGet,
    dossier,
    error: errorDossierGet,
  } = dossierGet;

  const dossierUpdate = useSelector((state) => state.dossierUpdate);
  const {
    loading: loadingDossierUpdate,
    dossier: dossierUpdated,
    success: successDossierUpdate,
    error: errorDossierUpdate,
  } = dossierUpdate;

  useEffect(() => {
    if (id) dispatch(getDossierAction(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (dossier) {
      dispatch(getDemandeurAction(dossier?.id_demandeur));
      setDate_depo(dossier?.date_depo);
    }
  }, [dispatch, dossier]);

  useEffect(() => {
    if (userInfo) setCreator(userInfo?._id);
  }, [userInfo]);

  useEffect(() => {
    if (dossierUpdated) navigate("/dossiers");
  }, [navigate, successDossierUpdate, dossierUpdated]);

  const backHandler = () => {
    navigate("/dossiers");
  };

  const submitDossierHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateDossierAction(
        id,
        creator,
        dossier.id_demandeur,
        dossier.id_conjoin,
        date_depo,
        dossier.num_dos,
        adress,
        stuation_s_avec_d.toString(),
        stuation_s_andicap.toString(),
        num_conj,
        numb_p,
        dossier.type,
        dossier.gender_conj,
        remark,
        dossier.saisi_conj,
        dossier.scan_dossier
      )
    );
  };

  return (
    <MainScreen
      title={` معلومات ملف : ${demandeur?.nom}  ${demandeur?.prenom} | ${demandeur?.nom_fr} ${demandeur?.prenom_fr}`}
    >
      {errorDemandeurGet && (
        <ErrorMessage variant="danger">{errorDemandeurGet}</ErrorMessage>
      )}
      {loadingDemandeurGet && <Loading />}

      {errorDossierGet && (
        <ErrorMessage variant="danger">{errorDossierGet}</ErrorMessage>
      )}
      {loadingDossierGet && <Loading />}

      {errorDossierUpdate && (
        <ErrorMessage variant="danger">{errorDossierUpdate}</ErrorMessage>
      )}
      {loadingDossierUpdate && <Loading />}

      <form
        onSubmit={submitDossierHandler}
        className="container form-signin border shadow p-3 my-5 bg-light bg-gradient rounded"
      >
        <div>
          <div className="row text-right">
            <div className="col-sm order-sm-last">
              <label htmlFor="num_dos"> رقم الملف</label>
              <input
                defaultValue={dossier?.num_dos}
                disabled={true}
                type="text"
                id="num_dos"
                name="num_dos"
                className="form-control text-right"
                required
              />
              <br />

              <label htmlFor="date_depo"> تاريخ الإيداع </label>
              <input
                defaultValue={convertDateFormat(date_depo, "T").jsDate}
                type="date"
                id="date_depo"
                name="date_depo"
                className="form-control text-right"
                onChange={(e) => {
                  setDate_depo(e.target.value);
                }}
                required
              />
              <br />

              {demandeur?.stuation_f.toString() !== "C" &&
                demandeur?.gender.toString() !== "F" && (
                  <>
                    <label>عدد الزوجات</label>
                    <br />

                    <input
                      type="text"
                      id="garage"
                      name="num_conj"
                      className="form-control text-right"
                      value={dossier?.num_conj}
                      onChange={(e) => setNum_conj(e.target.value)}
                    />
                  </>
                )}

              <br />
              <label htmlFor="adress">العنوان</label>
              <input
                value={adress}
                type="text"
                name="adress"
                className="form-control text-right"
                onChange={(e) => setAdress(e.target.value)}
              />
              <br />
              <label htmlFor="num_enf">عدد الأولاد</label>
              <input
                value={num_enf}
                type="text"
                name="num_enf"
                className="form-control text-right"
                onChange={(e) => setNum_enf(e.target.value)}
              />
              <br />
              <label>الحالة الشخصية</label>
              <br />

              <input
                type="checkbox"
                id="stuation_s_avec_d"
                name="stuation_s_avec_d"
                onChange={(e) => {
                  setStuation_s_avec_d(e.target.checked);
                }}
              />
              <label
                className="form-control text-right"
                htmlFor="stuation_s_avec_d"
              >
                ذوي حقوق
              </label>
              <br />

              <input
                type="checkbox"
                id="stuation_s_andicap"
                name="stuation_s_andicap"
                onChange={(e) => setStuation_s_andicap(e.target.checked)}
              />
              <label
                className="form-control text-right"
                htmlFor="stuation_s_andicap"
              >
                معاق
              </label>
              <br />
              <br />

              <label>هل يوجد أشخاص متكفل بهم</label>
              <br />
              <select
                className="form-control text-right"
                id="hide_tutele"
                defaultValue="0"
                name="hide_tutele"
                onChange={(e) => setNumb_p(e.target.value)}
              >
                <option
                  name="hide_tutele"
                  value="0"
                  onChange={(e) => setNumb_p(e.target.value)}
                >
                  لا
                </option>
                <option
                  name="hide_tutele"
                  value="1"
                  onChange={(e) => setNumb_p(e.target.value)}
                >
                  نعم
                </option>
              </select>
              <br />
              <div hidden={numb_p === "0"}>
                <label htmlFor="numb_p_t">عدد الأشخاص المتكفل بهم</label>
                <br />
                <input
                  className="form-control text-right"
                  onChange={(e) => setNumb_p(e.target.value)}
                  type="text"
                  name="numb_p"
                />
                <br />
              </div>
            </div>
          </div>
          <div className="row text-right">
            <div className="col-sm order-sm-last my-2">
              <label htmlFor="remark">ملاحظات حول الملف</label>
              <input
                value={remark}
                type="text"
                id="remark"
                name="remark"
                className="form-control text-right"
                onChange={(e) => setRemark(e.target.value)}
              />
              <br />
            </div>
          </div>
          <div className="row text-right">
            <div className="col-sm order-sm-last my-2">
              <button
                className="btn btn-lg btn-primary btn-block"
                type="submit"
              >
                حفظ
              </button>
            </div>
            <div className="col-sm order-sm-first my-2">
              <button
                className="btn btn-lg btn-primary btn-block"
                onClick={() => backHandler()}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      </form>
    </MainScreen>
  );
}

export default UpdateDossiers;
