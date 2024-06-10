import axios from "axios";
import {
  ENQUETCNL_GET_FAIL,
  ENQUETCNL_GET_REQUEST,
  ENQUETCNL_GET_SUCCESS,
  ENQUETCNAS_GET_FAIL,
  ENQUETCNAS_GET_REQUEST,
  ENQUETCNAS_GET_SUCCESS,
  ENQUETCASNOS_GET_FAIL,
  ENQUETCASNOS_GET_REQUEST,
  ENQUETCASNOS_GET_SUCCESS,
  ENQUETCNL_LIST_FAIL,
  ENQUETCNL_LIST_REQUEST,
  ENQUETCNL_LIST_SUCCESS,
} from "../constants/enquetCNLConstants";

export const listEnquetCNLsAction =
  (fromDate, toDate) => async (dispatch, getState) => {
    try {
      dispatch({
        type: ENQUETCNL_LIST_REQUEST,
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

      const formData = {
        fromDate,
        toDate,
      };

      const { data } = await axios.post(
        "/api/dossiers/enquetCNLs",
        formData,
        config
      );

      dispatch({
        type: ENQUETCNL_LIST_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ENQUETCNL_LIST_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const getEnquetCNLAction =
  (dossierEnq) => async (dispatch, getState) => {
    try {
      dispatch({
        type: ENQUETCNL_GET_REQUEST,
      });
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        responseType: "arraybuffer",
      };

      const formData = { dossierEnq: dossierEnq };
      const data = await axios.post(
        `/api/dossiers/enqCNL`,
        formData,
        config
      );

      dispatch({
        type: ENQUETCNL_GET_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ENQUETCNL_GET_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const getEnquetCNASAction =
  (dossierEnq) => async (dispatch, getState) => {
    try {
      dispatch({
        type: ENQUETCNAS_GET_REQUEST,
      });
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        responseType: "arraybuffer",
      };

      const formData = { dossierEnq: dossierEnq };
      const data = await axios.post(`/api/dossiers/enqCNAS`, formData, config);

      dispatch({
        type: ENQUETCNAS_GET_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ENQUETCNAS_GET_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const getEnquetCASNOSAction =
  (dossierEnq) => async (dispatch, getState) => {
    try {
      dispatch({
        type: ENQUETCASNOS_GET_REQUEST,
      });
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
        responseType: "arraybuffer",
      };

      const formData = { dossierEnq: dossierEnq };
      const data = await axios.post(
        `/api/dossiers/enqCASNOS`,
        formData,
        config
      );

      dispatch({
        type: ENQUETCASNOS_GET_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ENQUETCASNOS_GET_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
