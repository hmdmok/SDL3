import axios from "axios";
import {
  COMMUNE_ADD_FAIL,
  COMMUNE_ADD_REQUEST,
  COMMUNE_ADD_SUCCESS,
  COMMUNE_DELETE_FAIL,
  COMMUNE_DELETE_REQUEST,
  COMMUNE_DELETE_SUCCESS,
  COMMUNE_GET_FAIL,
  COMMUNE_GET_REQUEST,
  COMMUNE_GET_SUCCESS,
  COMMUNE_GETW_FAIL,
  COMMUNE_GETW_REQUEST,
  COMMUNE_GETW_SUCCESS,
  COMMUNE_LIST_FAIL,
  COMMUNE_LIST_REQUEST,
  COMMUNE_LIST_SUCCESS,
  COMMUNE_UPDATE_FAIL,
  COMMUNE_UPDATE_REQUEST,
  COMMUNE_UPDATE_SUCCESS,
} from "../constants/communeConstants";

export const addCommuneAction =
  (code, nomAr, nomFr, codeWilaya) => async (dispatch, getState) => {
    try {
      dispatch({ type: COMMUNE_ADD_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const formData = { code, nomAr, nomFr, codeWilaya };

      const data = await axios.post("/api/communes/create", formData, config);

      dispatch({ type: COMMUNE_ADD_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: COMMUNE_ADD_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const listCommunesAction = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: COMMUNE_LIST_REQUEST,
    });

    const { data } = await axios.get("/api/communes");

    dispatch({
      type: COMMUNE_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: COMMUNE_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listCommunesByWilayaAction =
  (codeWilaya) => async (dispatch, getState) => {
    try {
      dispatch({
        type: COMMUNE_GETW_REQUEST,
      });

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const formData = { codeWilaya };

      const { data } = await axios.post("/api/communes", formData, config);

      dispatch({
        type: COMMUNE_GETW_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: COMMUNE_GETW_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const getCommuneAction = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: COMMUNE_GET_REQUEST,
    });

    const { data } = await axios.get(`/api/communes/${id}`);

    dispatch({
      type: COMMUNE_GET_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: COMMUNE_GET_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateCommuneAction =
  (id, code, nomAr, nomFr, codeWilaya) => async (dispatch, getState) => {
    try {
      dispatch({ type: COMMUNE_UPDATE_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const formData = { code, nomAr, nomFr, codeWilaya };
      const { data } = await axios.put(`/api/communes/${id}`, formData, config);
      dispatch({ type: COMMUNE_UPDATE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: COMMUNE_UPDATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const deleteCommuneAction = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: COMMUNE_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.delete(`/api/communes/${id}`, config);
    dispatch({ type: COMMUNE_DELETE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: COMMUNE_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
