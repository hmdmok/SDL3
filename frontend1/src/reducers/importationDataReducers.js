import {
  IMPORTATIONDATA_SEND_FAIL,
  IMPORTATIONDATA_SEND_REQUEST,
  IMPORTATIONDATA_SEND_SUCCESS,
  
} from "../constants/importationDataConstants";

export const importationDataReducer = (state = {}, actions) => {
  switch (actions.type) {
    case IMPORTATIONDATA_SEND_REQUEST:
      return { loading: true };
    case IMPORTATIONDATA_SEND_SUCCESS:
      return { loading: false, imported: actions.payload, success: true };
    case IMPORTATIONDATA_SEND_FAIL:
      return { loading: false, error: actions.payload, success: true };

    default:
      return state;
  }
};
