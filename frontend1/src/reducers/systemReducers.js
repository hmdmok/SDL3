import {
  SYSTEM_ADD_FAIL,
  SYSTEM_ADD_REQUEST,
  SYSTEM_ADD_SUCCESS,
  SYSTEM_CHECK_REQUEST,
  SYSTEM_CHECK_SUCCESS,
  SYSTEM_CHECK_FAIL,
  SYSTEM_UPDATE_FAIL,
  SYSTEM_UPDATE_REQUEST,
  SYSTEM_UPDATE_SUCCESS,
} from "../constants/systemConstants";

export const systemCheckReducer = (state = {}, actions) => {
  switch (actions.type) {
    case SYSTEM_CHECK_REQUEST:
      return { loading: true };
    case SYSTEM_CHECK_SUCCESS:
      return { loading: false, systemInfo: actions.payload };
    case SYSTEM_CHECK_FAIL:
      return { loading: false, error: actions.payload };
    default:
      return state;
  }
};

export const systemAddReducer = (state = {}, actions) => {
  switch (actions.type) {
    case SYSTEM_ADD_REQUEST:
      return { loading: true };
    case SYSTEM_ADD_SUCCESS:
      return { loading: false, systemInfo: actions.payload };
    case SYSTEM_ADD_FAIL:
      return { loading: false, error: actions.payload };

    default:
      return state;
  }
};

export const systemUpdateReducer = (state = {}, actions) => {
  switch (actions.type) {
    case SYSTEM_UPDATE_REQUEST:
      return { loading: true };
    case SYSTEM_UPDATE_SUCCESS:
      return { loading: false, success: true };
    case SYSTEM_UPDATE_FAIL:
      return { loading: false, error: actions.payload, success: false };

    default:
      return state;
  }
};
