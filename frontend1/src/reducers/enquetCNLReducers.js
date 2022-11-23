import {
  ENQUETCNL_ADD_FAIL,
  ENQUETCNL_ADD_REQUEST,
  ENQUETCNL_ADD_SUCCESS,
  ENQUETCNL_DELETE_FAIL,
  ENQUETCNL_DELETE_REQUEST,
  ENQUETCNL_DELETE_SUCCESS,
  ENQUETCNL_GET_FAIL,
  ENQUETCNL_GET_REQUEST,
  ENQUETCNL_GET_SUCCESS,
  ENQUETCNL_LIST_FAIL,
  ENQUETCNL_LIST_REQUEST,
  ENQUETCNL_LIST_SUCCESS,
  ENQUETCNL_UPDATE_FAIL,
  ENQUETCNL_UPDATE_REQUEST,
  ENQUETCNL_UPDATE_SUCCESS,
} from "../constants/enquetCNLConstants";

export const enquetCNLAddReducer = (state = {}, actions) => {
  switch (actions.type) {
    case ENQUETCNL_ADD_REQUEST:
      return { loading: true };
    case ENQUETCNL_ADD_SUCCESS:
      return { loading: false, enquetCNL: actions.payload, success: true };
    case ENQUETCNL_ADD_FAIL:
      return { loading: false, error: actions.payload, success: true };

    default:
      return state;
  }
};

export const enquetCNLListReducer = (state = { enquetCNLs: [] }, actions) => {
  switch (actions.type) {
    case ENQUETCNL_LIST_REQUEST:
      return { loading: true };
    case ENQUETCNL_LIST_SUCCESS:
      return { loading: false, enquetCNLs: actions.payload };
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
      return { loading: false, enquetCNL: actions.payload };
    case ENQUETCNL_GET_FAIL:
      return { loading: false, error: actions.payload };

    default:
      return state;
  }
};

export const enquetCNLUpdateReducer = (state = {}, actions) => {
  switch (actions.type) {
    case ENQUETCNL_UPDATE_REQUEST:
      return { loading: true };
    case ENQUETCNL_UPDATE_SUCCESS:
      return { loading: false, enquetCNL: actions.payload, success: true };
    case ENQUETCNL_UPDATE_FAIL:
      return { loading: false, error: actions.payload, success: false };

    default:
      return state;
  }
};

export const enquetCNLDeleteReducer = (state = {}, actions) => {
  switch (actions.type) {
    case ENQUETCNL_DELETE_REQUEST:
      return { loading: true };
    case ENQUETCNL_DELETE_SUCCESS:
      return { loading: false, success: true };
    case ENQUETCNL_DELETE_FAIL:
      return { loading: false, error: actions.payload, success: false };

    default:
      return state;
  }
};
