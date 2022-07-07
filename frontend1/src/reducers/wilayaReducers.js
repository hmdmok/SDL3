import {
  WILAYA_ADD_FAIL,
  WILAYA_ADD_REQUEST,
  WILAYA_ADD_SUCCESS,
  WILAYA_DELETE_FAIL,
  WILAYA_DELETE_REQUEST,
  WILAYA_DELETE_SUCCESS,
  WILAYA_GET_FAIL,
  WILAYA_GET_REQUEST,
  WILAYA_GET_SUCCESS,
  WILAYA_LIST_FAIL,
  WILAYA_LIST_REQUEST,
  WILAYA_LIST_SUCCESS,
  WILAYA_UPDATE_FAIL,
  WILAYA_UPDATE_REQUEST,
  WILAYA_UPDATE_SUCCESS,
} from "../constants/wilayaConstants";

export const wilayaAddReducer = (state = {}, actions) => {
  switch (actions.type) {
    case WILAYA_ADD_REQUEST:
      return { loading: true };
    case WILAYA_ADD_SUCCESS:
      return { loading: false, success: true };
    case WILAYA_ADD_FAIL:
      return { loading: false, error: actions.payload, success: false };

    default:
      return state;
  }
};

export const wilayaListReducer = (state = { wilayas: [] }, actions) => {
  switch (actions.type) {
    case WILAYA_LIST_REQUEST:
      return { loading: true };
    case WILAYA_LIST_SUCCESS:
      return { loading: false, wilayas: actions.payload };
    case WILAYA_LIST_FAIL:
      return { loading: false, error: actions.payload };

    default:
      return state;
  }
};

export const wilayaGetReducer = (state = {}, actions) => {
  switch (actions.type) {
    case WILAYA_GET_REQUEST:
      return { loading: true };
    case WILAYA_GET_SUCCESS:
      return { loading: false, wilaya: actions.payload };
    case WILAYA_GET_FAIL:
      return { loading: false, error: actions.payload };

    default:
      return state;
  }
};

export const wilayaUpdateReducer = (state = {}, actions) => {
  switch (actions.type) {
    case WILAYA_UPDATE_REQUEST:
      return { loading: true };
    case WILAYA_UPDATE_SUCCESS:
      return { loading: false, success: true };
    case WILAYA_UPDATE_FAIL:
      return { loading: false, error: actions.payload, success: false };

    default:
      return state;
  }
};

export const wilayaDeleteReducer = (state = {}, actions) => {
  switch (actions.type) {
    case WILAYA_DELETE_REQUEST:
      return { loading: true };
    case WILAYA_DELETE_SUCCESS:
      return { loading: false, success: true };
    case WILAYA_DELETE_FAIL:
      return { loading: false, error: actions.payload, success: false };

    default:
      return state;
  }
};
