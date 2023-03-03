import axios from "axios";
import {
  DAIRA_GET_FAIL,
  DAIRA_GET_REQUEST,
  DAIRA_GET_SUCCESS,
  DAIRA_GETW_FAIL,
  DAIRA_GETW_REQUEST,
  DAIRA_GETW_SUCCESS,
  DAIRA_LIST_FAIL,
  DAIRA_LIST_REQUEST,
  DAIRA_LIST_SUCCESS,
} from "../constants/dairaConstants";

export const listDairasAction = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: DAIRA_LIST_REQUEST,
    });

    const { data } = await axios.get("/api/dairas");

    dispatch({
      type: DAIRA_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: DAIRA_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listDairasByWilayaAction =
  (codeWilaya) => async (dispatch, getState) => {
    try {
      dispatch({
        type: DAIRA_GETW_REQUEST,
      });

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const formData = { codeWilaya };

      const { data } = await axios.post("/api/dairas", formData, config);

      dispatch({
        type: DAIRA_GETW_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: DAIRA_GETW_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
