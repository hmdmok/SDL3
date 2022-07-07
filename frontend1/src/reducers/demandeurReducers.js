import {
  DEMANDEUR_ADD_FAIL,
  DEMANDEUR_ADD_REQUEST,
  DEMANDEUR_ADD_SUCCESS,
  DEMANDEUR_DELETE_FAIL,
  DEMANDEUR_DELETE_REQUEST,
  DEMANDEUR_DELETE_SUCCESS,
  DEMANDEUR_GET_FAIL,
  DEMANDEUR_GET_REQUEST,
  DEMANDEUR_GET_SUCCESS,
  DEMANDEUR_LIST_FAIL,
  DEMANDEUR_LIST_REQUEST,
  DEMANDEUR_LIST_SUCCESS,
  DEMANDEUR_UPDATE_FAIL,
  DEMANDEUR_UPDATE_REQUEST,
  DEMANDEUR_UPDATE_SUCCESS,
} from "../constants/demandeurConstants";

export const demandeurAddReducer = (state = {}, actions) => {
  switch (actions.type) {
    case DEMANDEUR_ADD_REQUEST:
      return { loading: true };
    case DEMANDEUR_ADD_SUCCESS:
      return { loading: false, demandeur: actions.payload, success: true };
    case DEMANDEUR_ADD_FAIL:
      return { loading: false, error: actions.payload, success: true };

    default:
      return state;
  }
};

export const demandeurListReducer = (state = { demandeurs: [] }, actions) => {
  switch (actions.type) {
    case DEMANDEUR_LIST_REQUEST:
      return { loading: true };
    case DEMANDEUR_LIST_SUCCESS:
      return { loading: false, demandeurs: actions.payload };
    case DEMANDEUR_LIST_FAIL:
      return { loading: false, error: actions.payload };

    default:
      return state;
  }
};

export const demandeurGetReducer = (state = {}, actions) => {
  switch (actions.type) {
    case DEMANDEUR_GET_REQUEST:
      return { loading: true };
    case DEMANDEUR_GET_SUCCESS:
      return { loading: false, demandeur: actions.payload };
    case DEMANDEUR_GET_FAIL:
      return { loading: false, error: actions.payload };

    default:
      return state;
  }
};

export const demandeurUpdateReducer = (state = {}, actions) => {
  switch (actions.type) {
    case DEMANDEUR_UPDATE_REQUEST:
      return { loading: true };
    case DEMANDEUR_UPDATE_SUCCESS:
      return { loading: false, success: true };
    case DEMANDEUR_UPDATE_FAIL:
      return { loading: false, error: actions.payload, success: false };

    default:
      return state;
  }
};

export const demandeurDeleteReducer = (state = {}, actions) => {
  switch (actions.type) {
    case DEMANDEUR_DELETE_REQUEST:
      return { loading: true };
    case DEMANDEUR_DELETE_SUCCESS:
      return { loading: false, success: true };
    case DEMANDEUR_DELETE_FAIL:
      return { loading: false, error: actions.payload, success: false };

    default:
      return state;
  }
};
