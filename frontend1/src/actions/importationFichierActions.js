import axios from "axios";
import {
  IMPORTATIONFICHIER_SEND_REQUEST,
  IMPORTATIONFICHIER_SEND_SUCCESS,
  IMPORTATIONFICHIER_SEND_FAIL,
} from "../constants/importationFichierConstants";

export const sendImportationFichierAction =
  (file, creator, remark) => async (dispatch, getState) => {
    try {
      dispatch({ type: IMPORTATIONFICHIER_SEND_REQUEST });
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
      formData.append("importation_File", file);
      const { data } = await axios.post(
        "/api/importationData/update",
        formData,
        config
      );
      dispatch({ type: IMPORTATIONFICHIER_SEND_SUCCESS, payload: data });
      localStorage.setItem("fichierInfo", JSON.stringify(data));
    } catch (error) {
      dispatch({
        type: IMPORTATIONFICHIER_SEND_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
