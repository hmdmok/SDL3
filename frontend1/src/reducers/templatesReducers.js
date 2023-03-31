import {
  IMPORTATIONFICHIERTEMPLATE_DOWNLOAD_FAIL,
  IMPORTATIONFICHIERTEMPLATE_DOWNLOAD_REQUEST,
  IMPORTATIONFICHIERTEMPLATE_DOWNLOAD_SUCCESS,
} from "../constants/templatesConstants";

export const importationFichierTempReducer = (state = {}, actions) => {
  switch (actions.type) {
    case IMPORTATIONFICHIERTEMPLATE_DOWNLOAD_REQUEST:
      return { loading: true };
    case IMPORTATIONFICHIERTEMPLATE_DOWNLOAD_SUCCESS:
      return {
        loading: false,
        importationFichierTemp: actions.payload,
        success: true,
      };
    case IMPORTATIONFICHIERTEMPLATE_DOWNLOAD_FAIL:
      return { loading: false, error: actions.payload };

    default:
      return state;
  }
};
