import axios from "axios";
import {
  WILAYA_ADD_FAIL,
  WILAYA_ADD_REQUEST,
  WILAYA_ADD_SUCCESS,
  WILAYA_DELETE_FAIL,
  WILAYA_DELETE_REQUEST,
  WILAYA_DELETE_SUCCESS,
  WILAYA_GET_FAIL,
  WILAYA_GET_REQUEST,
  WILAYA_GET_SUCCESS,
  WILAYA_LIST_FAIL,
  WILAYA_LIST_REQUEST,
  WILAYA_LIST_SUCCESS,
  WILAYA_UPDATE_FAIL,
  WILAYA_UPDATE_REQUEST,
  WILAYA_UPDATE_SUCCESS,
} from "../constants/wilayaConstants";

export const addWilayaAction =
  (code, nomAr, nomFr) => async (dispatch, getState) => {
    try {
      dispatch({ type: WILAYA_ADD_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const formData = { code, nomAr, nomFr };

      const data = await axios.post("/api/wilayas/create", formData, config);

      dispatch({ type: WILAYA_ADD_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: WILAYA_ADD_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const listWilayasAction = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: WILAYA_LIST_REQUEST,
    });

    const { data } = await axios.get("/api/wilayas");

    dispatch({
      type: WILAYA_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: WILAYA_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getWilayaAction = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: WILAYA_GET_REQUEST,
    });

    const { data } = await axios.get(`/api/wilayas/${id}`);

    dispatch({
      type: WILAYA_GET_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: WILAYA_GET_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateWilayaAction =
  (id, code, nomAr, nomFr) => async (dispatch, getState) => {
    try {
      dispatch({ type: WILAYA_UPDATE_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const formData = { code, nomAr, nomFr };
      const { data } = await axios.put(`/api/wilayas/${id}`, formData, config);
      dispatch({ type: WILAYA_UPDATE_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: WILAYA_UPDATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const deleteWilayaAction = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: WILAYA_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.delete(`/api/wilayas/${id}`, config);
    dispatch({ type: WILAYA_DELETE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: WILAYA_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
