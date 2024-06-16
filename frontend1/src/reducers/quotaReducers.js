import {
  QUOTA_ADD_FAIL,
  QUOTA_ADD_REQUEST,
  QUOTA_ADD_SUCCESS,
  QUOTA_DELETE_FAIL,
  QUOTA_DELETE_REQUEST,
  QUOTA_DELETE_SUCCESS,
  QUOTA_LIST_FAIL,
  QUOTA_LIST_REQUEST,
  QUOTA_LIST_SUCCESS,
  QUOTA_UPDATE_FAIL,
  QUOTA_UPDATE_REQUEST,
  QUOTA_UPDATE_SUCCESS,
} from "../constants/quotaConstants";

export const quotaAddReducer = (state = {}, actions) => {
  switch (actions.type) {
    case QUOTA_ADD_REQUEST:
      return { loading: true };
    case QUOTA_ADD_SUCCESS:
      return { loading: false, quotaInfo: actions.payload };
    case QUOTA_ADD_FAIL:
      return { loading: false, error: actions.payload };

    default:
      return state;
  }
};

export const quotaListReducer = (state = { quotas: [] }, actions) => {
  switch (actions.type) {
    case QUOTA_LIST_REQUEST:
      return { loading: true };
    case QUOTA_LIST_SUCCESS:
      return { loading: false, quotas: actions.payload };
    case QUOTA_LIST_FAIL:
      return { loading: false, error: actions.payload };

    default:
      return state;
  }
};

export const quotaUpdateReducer = (state = {}, actions) => {
  switch (actions.type) {
    case QUOTA_UPDATE_REQUEST:
      return { loading: true };
    case QUOTA_UPDATE_SUCCESS:
      return { loading: false, success: true };
    case QUOTA_UPDATE_FAIL:
      return { loading: false, error: actions.payload, success: false };

    default:
      return state;
  }
};

export const quotaDeleteReducer = (state = {}, actions) => {
  switch (actions.type) {
    case QUOTA_DELETE_REQUEST:
      return { loading: true };
    case QUOTA_DELETE_SUCCESS:
      return { loading: false, success: true };
    case QUOTA_DELETE_FAIL:
      return { loading: false, error: actions.payload, success: false };

    default:
      return state;
  }
};
