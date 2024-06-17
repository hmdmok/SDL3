import axios from "axios";
import {
  LIST_BENEFISIERS_GET_FAIL,
  LIST_BENEFISIERS_GET_REQUEST,
  LIST_BENEFISIERS_GET_SUCCESS,
} from "../constants/benifisierConstants";

export const listBenefisiersAction =
  (dossiersList, type, quotaDate) => async (dispatch, getState) => {
    try {
      dispatch({
        type: LIST_BENEFISIERS_GET_REQUEST,
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

      const formData = {
        dossiersList: dossiersList,
        type: type,
        quotaDate: quotaDate,
      };

      const data = await axios.post(
        "/api/dossiers/listBenefisiers",
        formData,
        config
      );

      dispatch({
        type: LIST_BENEFISIERS_GET_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: LIST_BENEFISIERS_GET_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
