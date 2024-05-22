import {
  IMPORTATIONFICHIER_SEND_FAIL,
  IMPORTATIONFICHIER_SEND_REQUEST,
  IMPORTATIONFICHIER_SEND_SUCCESS,
} from "../constants/importationFichierConstants";

export const importationFichierReducer = (state = {}, actions) => {
  switch (actions.type) {
    case IMPORTATIONFICHIER_SEND_REQUEST:
      return { loading: true };
    case IMPORTATIONFICHIER_SEND_SUCCESS:
      return { loading: false, fichierInfo: actions.payload };
    case IMPORTATIONFICHIER_SEND_FAIL:
      return { loading: false, error: actions.payload };

    default:
      return state;
  }
};
