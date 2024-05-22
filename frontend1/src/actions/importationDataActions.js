import axios from "axios";
import {
  IMPORTATIONDATA_SEND_REQUEST,
  IMPORTATIONDATA_SEND_SUCCESS,
  IMPORTATIONDATA_SEND_FAIL,
} from "../constants/importationDataConstants";

export const sendImportationDataAction =
  (file, creator, fileName, remark) => async (dispatch, getState) => {
    try {
      dispatch({ type: IMPORTATIONDATA_SEND_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const formData = new FormData();
      formData.append("creator", creator);
      formData.append("remark", remark);
      formData.append("fileName", fileName);
      formData.append("importation_File", file);
      const { data } = await axios.post(
        "/api/importationData",
        formData,
        config
      );
      dispatch({ type: IMPORTATIONDATA_SEND_SUCCESS, payload: data });
    } catch (error) {
      dispatch({
        type: IMPORTATIONDATA_SEND_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
