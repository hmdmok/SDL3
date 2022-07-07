import axios from "axios";
import {
  DEMANDEUR_ADD_FAIL,
  DEMANDEUR_ADD_REQUEST,
  DEMANDEUR_ADD_SUCCESS,
  DEMANDEUR_DELETE_FAIL,
  DEMANDEUR_DELETE_REQUEST,
  DEMANDEUR_DELETE_SUCCESS,
  DEMANDEUR_GET_FAIL,
  DEMANDEUR_GET_REQUEST,
  DEMANDEUR_GET_SUCCESS,
  DEMANDEUR_LIST_FAIL,
  DEMANDEUR_LIST_REQUEST,
  DEMANDEUR_LIST_SUCCESS,
  DEMANDEUR_UPDATE_FAIL,
  DEMANDEUR_UPDATE_REQUEST,
  DEMANDEUR_UPDATE_SUCCESS,
} from "../constants/demandeurConstants";

export const addDemandeurAction =
  (
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
  ) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: DEMANDEUR_ADD_REQUEST });
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
        remark,
      };

      const { data } = await axios.post(
        "/api/persons/create",
        formData,
        config
      );

      dispatch({ type: DEMANDEUR_ADD_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: DEMANDEUR_ADD_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const listDemandeursAction = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: DEMANDEUR_LIST_REQUEST,
    });

    const { data } = await axios.get("/api/demandeurs");

    dispatch({
      type: DEMANDEUR_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: DEMANDEUR_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getDemandeurAction = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: DEMANDEUR_GET_REQUEST,
    });

    const { data } = await axios.get(`/api/persons/${id}`);

    dispatch({
      type: DEMANDEUR_GET_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: DEMANDEUR_GET_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateDemandeurAction =
  (
    id,
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
  ) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: DEMANDEUR_UPDATE_REQUEST });
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
        remark,
      };

      const { data } = await axios.put(`/api/persons/${id}`, formData, config);
      dispatch({ type: DEMANDEUR_UPDATE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: DEMANDEUR_UPDATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const deleteDemandeurAction = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: DEMANDEUR_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.delete(`/api/persons/${id}`, config);
    dispatch({ type: DEMANDEUR_DELETE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: DEMANDEUR_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
