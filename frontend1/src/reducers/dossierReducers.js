import {
  DOSSIER_ADD_FAIL,
  DOSSIER_ADD_REQUEST,
  DOSSIER_ADD_SUCCESS,
  DOSSIER_DELETE_FAIL,
  DOSSIER_DELETE_REQUEST,
  DOSSIER_DELETE_SUCCESS,
  DOSSIER_GET_FAIL,
  DOSSIER_GET_REQUEST,
  DOSSIER_GET_SUCCESS,
  DOSSIER_LIST_FAIL,
  DOSSIER_LIST_REQUEST,
  DOSSIER_LIST_SUCCESS,
  DOSSIER_UPDATE_FAIL,
  DOSSIER_UPDATE_REQUEST,
  DOSSIER_UPDATE_SUCCESS,
} from "../constants/dossierConstants";

export const dossierAddReducer = (state = {}, actions) => {
  switch (actions.type) {
    case DOSSIER_ADD_REQUEST:
      return { loading: true };
    case DOSSIER_ADD_SUCCESS:
      return { loading: false, dossier: actions.payload, success: true };
    case DOSSIER_ADD_FAIL:
      return { loading: false, error: actions.payload, success: true };

    default:
      return state;
  }
};

export const dossierListReducer = (state = { dossiers: [] }, actions) => {
  switch (actions.type) {
    case DOSSIER_LIST_REQUEST:
      return { loading: true };
    case DOSSIER_LIST_SUCCESS:
      return { loading: false, dossiers: actions.payload };
    case DOSSIER_LIST_FAIL:
      return { loading: false, error: actions.payload };

    default:
      return state;
  }
};

export const dossierGetReducer = (state = {}, actions) => {
  switch (actions.type) {
    case DOSSIER_GET_REQUEST:
      return { loading: true };
    case DOSSIER_GET_SUCCESS:
      return { loading: false, dossier: actions.payload };
    case DOSSIER_GET_FAIL:
      return { loading: false, error: actions.payload };

    default:
      return state;
  }
};

export const dossierUpdateReducer = (state = {}, actions) => {
  switch (actions.type) {
    case DOSSIER_UPDATE_REQUEST:
      return { loading: true };
    case DOSSIER_UPDATE_SUCCESS:
      return { loading: false, dossier: actions.payload, success: true };
    case DOSSIER_UPDATE_FAIL:
      return { loading: false, error: actions.payload, success: false };

    default:
      return state;
  }
};

export const dossierDeleteReducer = (state = {}, actions) => {
  switch (actions.type) {
    case DOSSIER_DELETE_REQUEST:
      return { loading: true };
    case DOSSIER_DELETE_SUCCESS:
      return { loading: false, success: true };
    case DOSSIER_DELETE_FAIL:
      return { loading: false, error: actions.payload, success: false };

    default:
      return state;
  }
};
