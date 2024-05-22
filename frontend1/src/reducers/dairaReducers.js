import {
  DAIRA_GETW_FAIL,
  DAIRA_GETW_REQUEST,
  DAIRA_GETW_SUCCESS,
  DAIRA_LIST_FAIL,
  DAIRA_LIST_REQUEST,
  DAIRA_LIST_SUCCESS,
} from "../constants/dairaConstants";

export const dairaListReducer = (state = { dairas: [] }, actions) => {
  switch (actions.type) {
    case DAIRA_LIST_REQUEST:
      return { loading: true };
    case DAIRA_LIST_SUCCESS:
      return { loading: false, dairas: actions.payload };
    case DAIRA_LIST_FAIL:
      return { loading: false, error: actions.payload };

    default:
      return state;
  }
};

export const dairaGetByWilayaReducer = (state = { dairas: [] }, actions) => {
  switch (actions.type) {
    case DAIRA_GETW_REQUEST:
      return { loading: true };
    case DAIRA_GETW_SUCCESS:
      return { loading: false, dairas: actions.payload };
    case DAIRA_GETW_FAIL:
      return { loading: false, error: actions.payload };

    default:
      return state;
  }
};
