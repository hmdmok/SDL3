import axios from "axios";
import {
  SYSTEM_ADD_FAIL,
  SYSTEM_ADD_REQUEST,
  SYSTEM_ADD_SUCCESS,
  SYSTEM_CHECK_FAIL,
  SYSTEM_CHECK_REQUEST,
  SYSTEM_CHECK_SUCCESS,
  SYSTEM_UPDATE_FAIL,
  SYSTEM_UPDATE_REQUEST,
  SYSTEM_UPDATE_SUCCESS,
} from "../constants/systemConstants";

export const checkSystem = () => async (dispatch) => {
  try {
    dispatch({ type: SYSTEM_CHECK_REQUEST });

    const { data } = await axios.get("/api/system/check");
    dispatch({ type: SYSTEM_CHECK_SUCCESS, payload: data });
    localStorage.setItem("systemInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: SYSTEM_CHECK_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const addSystem =
  (administrationType, administrationName) => async (dispatch) => {
    try {
      dispatch({ type: SYSTEM_ADD_REQUEST });

      const { data } = await axios.post("/api/system", {
        administrationType: administrationType,
        administrationName: administrationName,
      });

      dispatch({ type: SYSTEM_ADD_SUCCESS, payload: data });

      localStorage.setItem("systemInfo", JSON.stringify(data));
    } catch (error) {
      dispatch({
        type: SYSTEM_ADD_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const updateSystem =
  (
    id,
    installDate,
    installType,
    administrationType,
    administrationName,
    machineCode,
    onlineCheckDate
  ) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: SYSTEM_UPDATE_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data } = await axios.put(
        `/api/system/${id}`,
        {
          installDate: installDate,
          installType: installType,
          administrationType: administrationType,
          administrationName: administrationName,
          machineCode: machineCode,
          onlineCheckDate: onlineCheckDate,
        },
        config
      );
      dispatch({ type: SYSTEM_UPDATE_SUCCESS, payload: data });

      localStorage.setItem("systemInfo", JSON.stringify(data));
    } catch (error) {
      dispatch({
        type: SYSTEM_UPDATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
