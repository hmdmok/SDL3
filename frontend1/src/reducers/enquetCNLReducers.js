import {
  ENQUETCNL_GET_FAIL,
  ENQUETCNL_GET_REQUEST,
  ENQUETCNL_GET_SUCCESS,
  ENQUETCNAS_GET_FAIL,
  ENQUETCNAS_GET_REQUEST,
  ENQUETCNAS_GET_SUCCESS,
  ENQUETCASNOS_GET_FAIL,
  ENQUETCASNOS_GET_REQUEST,
  ENQUETCASNOS_GET_SUCCESS,
  ENQUETCNL_LIST_FAIL,
  ENQUETCNL_LIST_REQUEST,
  ENQUETCNL_LIST_SUCCESS,
} from "../constants/enquetCNLConstants";

export const enquetCNLListReducer = (state = { enquetCNLs: [] }, actions) => {
  switch (actions.type) {
    case ENQUETCNL_LIST_REQUEST:
      return { loading: true };
    case ENQUETCNL_LIST_SUCCESS:
      return { loading: false, enquetCNLs: actions.payload, success: true };
    case ENQUETCNL_LIST_FAIL:
      return { loading: false, error: actions.payload };

    default:
      return state;
  }
};

export const enquetCNLGetReducer = (state = {}, actions) => {
  switch (actions.type) {
    case ENQUETCNL_GET_REQUEST:
      return { loading: true };
    case ENQUETCNL_GET_SUCCESS:
      return { loading: false, enquetCNLs: actions.payload, success: true };
    case ENQUETCNL_GET_FAIL:
      return { loading: false, error: actions.payload };

    default:
      return state;
  }
};

export const enquetCNASGetReducer = (state = {}, actions) => {
  switch (actions.type) {
    case ENQUETCNAS_GET_REQUEST:
      return { loading: true };
    case ENQUETCNAS_GET_SUCCESS:
      return { loading: false, enquetCNASs: actions.payload, success: true };
    case ENQUETCNAS_GET_FAIL:
      return { loading: false, error: actions.payload };

    default:
      return state;
  }
};

export const enquetCASNOSGetReducer = (state = {}, actions) => {
  switch (actions.type) {
    case ENQUETCASNOS_GET_REQUEST:
      return { loading: true };
    case ENQUETCASNOS_GET_SUCCESS:
      return { loading: false, enquetCASNOSs: actions.payload, success: true };
    case ENQUETCASNOS_GET_FAIL:
      return { loading: false, error: actions.payload };

    default:
      return state;
  }
};
