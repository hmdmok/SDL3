import axios from "axios";
import {
  DOSSIER_ADD_FAIL,
  DOSSIER_ADD_REQUEST,
  DOSSIER_ADD_SUCCESS,
  DOSSIER_DELETE_FAIL,
  DOSSIER_DELETE_REQUEST,
  DOSSIER_DELETE_SUCCESS,
  DOSSIER_GET_FAIL,
  DOSSIER_GET_REQUEST,
  DOSSIER_GET_SUCCESS,
  DOSSIER_LIST_FAIL,
  DOSSIER_LIST_REQUEST,
  DOSSIER_LIST_SUCCESS,
  DOSSIER_UPDATE_FAIL,
  DOSSIER_UPDATE_REQUEST,
  DOSSIER_UPDATE_SUCCESS,
} from "../constants/dossierConstants";

export const addDossierAction =
  (
    creator,
    id_demandeur,
    id_conjoin,
    date_depo,
    num_dos,
    num_enf,
    stuation_s_avec_d,
    stuation_s_andicap,
    stuation_d,
    numb_p,
    type,
    gender_conj,
    remark,
    saisi_conj,
    scan_dossier
  ) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: DOSSIER_ADD_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const formData = {
        creator,
        id_demandeur,
        id_conjoin,
        date_depo,
        num_dos,
        num_enf,
        stuation_s_avec_d,
        stuation_s_andicap,
        stuation_d,
        numb_p,
        type,
        gender_conj,
        remark,
        saisi_conj,
        scan_dossier,
      };

      const data = await axios.post("/api/dossiers/create", formData, config);

      dispatch({ type: DOSSIER_ADD_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: DOSSIER_ADD_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const listDossiersAction =
  (
    page,
    limit,
    search,
    sort,
    fromDate,
    toDate,
    p_m_35_dd,
    p_m_35_de,
    situationFamiliale
  ) =>
  async (dispatch, getState) => {
    try {
      dispatch({
        type: DOSSIER_LIST_REQUEST,
      });

      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const url = `/api/dossiers/filtred?page=${page}&limit=${limit}&search=${search}&sort=${sort?.sort},${sort?.order}&fromDate=${fromDate}&toDate=${toDate}&p_m_35_de=${p_m_35_de?.dateEtude},${p_m_35_de?.type}&p_m_35_dd=${p_m_35_dd}&stuation_f=${situationFamiliale}`;

      const { data } = await axios.get(url, config);
      dispatch({
        type: DOSSIER_LIST_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: DOSSIER_LIST_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const getDossierAction = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: DOSSIER_GET_REQUEST,
    });

    const { data } = await axios.get(`/api/dossiers/${id}`);

    dispatch({
      type: DOSSIER_GET_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: DOSSIER_GET_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
export const getDossierByNumAction =
  (num_dos, photo_file) => async (dispatch, getState) => {
    try {
      dispatch({
        type: DOSSIER_GET_REQUEST,
      });
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const formData = new FormData();
      formData.append("photo_link", photo_file);
      const { data } = await axios.post(
        `/api/dossiers/num/${num_dos}`,
        formData,
        config
      );

      dispatch({
        type: DOSSIER_GET_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: DOSSIER_GET_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const updateDossierAction =
  (
    id,
    creator,
    id_demandeur,
    id_conjoin,
    date_depo,
    num_dos,
    num_enf,
    stuation_s_avec_d,
    stuation_s_andicap,
    stuation_d,
    numb_p,
    type,
    gender_conj,
    remark,
    saisi_conj,
    scan_dossier
  ) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: DOSSIER_UPDATE_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const formData = {
        creator,
        id_demandeur,
        id_conjoin,
        date_depo,
        num_dos,
        num_enf,
        stuation_s_avec_d,
        stuation_s_andicap,
        stuation_d,
        numb_p,
        type,
        gender_conj,
        remark,
        saisi_conj,
        scan_dossier,
      };

      const { data } = await axios.put(`/api/dossiers/${id}`, formData, config);
      dispatch({ type: DOSSIER_UPDATE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: DOSSIER_UPDATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const deleteDossierAction = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: DOSSIER_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.delete(`/api/dossiers/${id}`, config);
    dispatch({ type: DOSSIER_DELETE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: DOSSIER_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
