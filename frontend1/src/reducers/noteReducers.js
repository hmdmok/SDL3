import {
  NOTE_ADD_FAIL,
  NOTE_ADD_REQUEST,
  NOTE_ADD_SUCCESS,
  NOTE_DELETE_FAIL,
  NOTE_DELETE_REQUEST,
  NOTE_DELETE_SUCCESS,
  NOTE_GET_FAIL,
  NOTE_GET_REQUEST,
  NOTE_GET_SUCCESS,
  NOTE_LIST_FAIL,
  NOTE_LIST_REQUEST,
  NOTE_LIST_SUCCESS,
  NOTE_UPDATE_FAIL,
  NOTE_UPDATE_REQUEST,
  NOTE_UPDATE_SUCCESS,
} from "../constants/noteConstants";

export const noteAddReducer = (state = {}, actions) => {
  switch (actions.type) {
    case NOTE_ADD_REQUEST:
      return { loading: true };
    case NOTE_ADD_SUCCESS:
      return { loading: false, success: true };
    case NOTE_ADD_FAIL:
      return { loading: false, error: actions.payload, success: false };

    default:
      return state;
  }
};

export const noteListReducer = (state = { notes: [] }, actions) => {
  switch (actions.type) {
    case NOTE_LIST_REQUEST:
      return { loading: true };
    case NOTE_LIST_SUCCESS:
      return { loading: false, notes: actions.payload };
    case NOTE_LIST_FAIL:
      return { loading: false, error: actions.payload };

    default:
      return state;
  }
};

export const noteGetReducer = (state = {}, actions) => {
  switch (actions.type) {
    case NOTE_GET_REQUEST:
      return { loading: true };
    case NOTE_GET_SUCCESS:
      return { loading: false, note: actions.payload };
    case NOTE_GET_FAIL:
      return { loading: false, error: actions.payload };

    default:
      return state;
  }
};

export const noteUpdateReducer = (state = {}, actions) => {
  switch (actions.type) {
    case NOTE_UPDATE_REQUEST:
      return { loading: true };
    case NOTE_UPDATE_SUCCESS:
      return { loading: false, success: true };
    case NOTE_UPDATE_FAIL:
      return { loading: false, error: actions.payload, success: false };

    default:
      return state;
  }
};

export const noteDeleteReducer = (state = {}, actions) => {
  switch (actions.type) {
    case NOTE_DELETE_REQUEST:
      return { loading: true };
    case NOTE_DELETE_SUCCESS:
      return { loading: false, success: true };
    case NOTE_DELETE_FAIL:
      return { loading: false, error: actions.payload, success: false };

    default:
      return state;
  }
};
