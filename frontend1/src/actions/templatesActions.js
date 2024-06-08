import axios from "axios";
import {
  IMPORTATIONFICHIERTEMPLATE_DOWNLOAD_FAIL,
  IMPORTATIONFICHIERTEMPLATE_DOWNLOAD_REQUEST,
  IMPORTATIONFICHIERTEMPLATE_DOWNLOAD_SUCCESS,
} from "../constants/templatesConstants";

export const downloadImportationFichierTemplateAction =
  (creator, langue) => async (dispatch) => {
    try {
      dispatch({ type: IMPORTATIONFICHIERTEMPLATE_DOWNLOAD_REQUEST });

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
        responseType: "arraybuffer",
      };

      const data = await axios.post(
        "/api/templates/importationFichierTemplate",
        {
          creator,
          langue,
        },
        config
      );
      dispatch({
        type: IMPORTATIONFICHIERTEMPLATE_DOWNLOAD_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: IMPORTATIONFICHIERTEMPLATE_DOWNLOAD_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
