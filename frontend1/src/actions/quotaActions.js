import axios from "axios";
import {
  QUOTA_ADD_FAIL,
  QUOTA_ADD_REQUEST,
  QUOTA_ADD_SUCCESS,
  QUOTA_DELETE_FAIL,
  QUOTA_DELETE_REQUEST,
  QUOTA_DELETE_SUCCESS,
  QUOTA_LIST_FAIL,
  QUOTA_LIST_REQUEST,
  QUOTA_LIST_SUCCESS,
  QUOTA_UPDATE_FAIL,
  QUOTA_UPDATE_REQUEST,
  QUOTA_UPDATE_SUCCESS,
} from "../constants/quotaConstants";

export const add =
  (quotaname, quotadate, quotaquant, quotascan, creator, remark) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: QUOTA_ADD_REQUEST });

      const formData = new FormData();
      formData.append("quotaname", quotaname);
      formData.append("quotadate", quotadate);
      formData.append("quotaquant", quotaquant);
      formData.append("creator", creator);
      formData.append("remark", remark);
      formData.append("quotascan", quotascan);

      const { data } = await axios.post("/api/quotas", formData);

      dispatch({ type: QUOTA_ADD_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: QUOTA_ADD_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const listQuotas = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: QUOTA_LIST_REQUEST,
    });

    const { data } = await axios.get("/api/quotas");

    dispatch({
      type: QUOTA_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: QUOTA_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const update =
  (id, quotaname, quotadate, quotaquant, quotascan, creator, remark) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: QUOTA_UPDATE_REQUEST });

      if (quotascan) {
        const formData = new FormData();
        formData.append("quotaname", quotaname);
        formData.append("quotadate", quotadate);
        formData.append("quotaquant", quotaquant);
        formData.append("creator", creator);
        formData.append("remark", remark);
        formData.append("quotascan", quotascan);
        const { data } = await axios.put(`/api/quotas/${id}`, formData);
        dispatch({ type: QUOTA_UPDATE_SUCCESS, payload: data });
      } else {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        const { data } = await axios.put(
          `/api/quotas/${id}`,
          {
            quotaname: quotaname,
            quotadate: quotadate,
            quotaquant: quotaquant,
            creator: creator,
            remark: remark,
            quotascan: quotascan,
          },
          config
        );
        dispatch({ type: QUOTA_UPDATE_SUCCESS, payload: data });
      }
    } catch (error) {
      dispatch({
        type: QUOTA_UPDATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const deleteQuotaAction = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: QUOTA_DELETE_REQUEST });

    const { data } = await axios.delete(`/api/quotas/${id}`);
    dispatch({ type: QUOTA_DELETE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: QUOTA_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
