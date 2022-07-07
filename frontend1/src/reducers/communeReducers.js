import {
  COMMUNE_ADD_FAIL,
  COMMUNE_ADD_REQUEST,
  COMMUNE_ADD_SUCCESS,
  COMMUNE_DELETE_FAIL,
  COMMUNE_DELETE_REQUEST,
  COMMUNE_DELETE_SUCCESS,
  COMMUNE_GET_FAIL,
  COMMUNE_GET_REQUEST,
  COMMUNE_GET_SUCCESS,
  COMMUNE_GETW_FAIL,
  COMMUNE_GETW_REQUEST,
  COMMUNE_GETW_SUCCESS,
  COMMUNE_LIST_FAIL,
  COMMUNE_LIST_REQUEST,
  COMMUNE_LIST_SUCCESS,
  COMMUNE_UPDATE_FAIL,
  COMMUNE_UPDATE_REQUEST,
  COMMUNE_UPDATE_SUCCESS,
} from "../constants/communeConstants";

export const communeAddReducer = (state = {}, actions) => {
  switch (actions.type) {
    case COMMUNE_ADD_REQUEST:
      return { loading: true };
    case COMMUNE_ADD_SUCCESS:
      return { loading: false, success: true };
    case COMMUNE_ADD_FAIL:
      return { loading: false, error: actions.payload, success: false };

    default:
      return state;
  }
};

export const communeListReducer = (state = { communes: [] }, actions) => {
  switch (actions.type) {
    case COMMUNE_LIST_REQUEST:
      return { loading: true };
    case COMMUNE_LIST_SUCCESS:
      return { loading: false, communes: actions.payload };
    case COMMUNE_LIST_FAIL:
      return { loading: false, error: actions.payload };

    default:
      return state;
  }
};

export const communeGetReducer = (state = {}, actions) => {
  switch (actions.type) {
    case COMMUNE_GET_REQUEST:
      return { loading: true };
    case COMMUNE_GET_SUCCESS:
      return { loading: false, commune: actions.payload };
    case COMMUNE_GET_FAIL:
      return { loading: false, error: actions.payload };

    default:
      return state;
  }
};

export const communeGetByWilayaReducer = (
  state = { communes: [] },
  actions
) => {
  switch (actions.type) {
    case COMMUNE_GETW_REQUEST:
      return { loading: true };
    case COMMUNE_GETW_SUCCESS:
      return { loading: false, communes: actions.payload };
    case COMMUNE_GETW_FAIL:
      return { loading: false, error: actions.payload };

    default:
      return state;
  }
};

export const communeUpdateReducer = (state = {}, actions) => {
  switch (actions.type) {
    case COMMUNE_UPDATE_REQUEST:
      return { loading: true };
    case COMMUNE_UPDATE_SUCCESS:
      return { loading: false, success: true };
    case COMMUNE_UPDATE_FAIL:
      return { loading: false, error: actions.payload, success: false };

    default:
      return state;
  }
};

export const communeDeleteReducer = (state = {}, actions) => {
  switch (actions.type) {
    case COMMUNE_DELETE_REQUEST:
      return { loading: true };
    case COMMUNE_DELETE_SUCCESS:
      return { loading: false, success: true };
    case COMMUNE_DELETE_FAIL:
      return { loading: false, error: actions.payload, success: false };

    default:
      return state;
  }
};
