import {
  FILES_ADD_FAIL,
  FILES_ADD_REQUEST,
  FILES_ADD_SUCCESS,
  FILES_DELETE_FAIL,
  FILES_DELETE_REQUEST,
  FILES_DELETE_SUCCESS,
  FILES_LIST_FAIL,
  FILES_LIST_REQUEST,
  FILES_LIST_SUCCESS,
  FILES_UPDATE_FAIL,
  FILES_UPDATE_REQUEST,
  FILES_UPDATE_SUCCESS,
} from "../constants/filesConstants";

export const filesAddReducer = (state = {}, actions) => {
  switch (actions.type) {
    case FILES_ADD_REQUEST:
      return { loading: true };
    case FILES_ADD_SUCCESS:
      return { loading: false, filesInfo: actions.payload };
    case FILES_ADD_FAIL:
      return { loading: false, error: actions.payload };

    default:
      return state;
  }
};

export const filesListReducer = (state = {}, actions) => {
  switch (actions.type) {
    case FILES_LIST_REQUEST:
      return { loading: true };
    case FILES_LIST_SUCCESS:
      return { loading: false, files: actions.payload };
    case FILES_LIST_FAIL:
      return { loading: false, error: actions.payload };

    default:
      return state;
  }
};

export const filesUpdateReducer = (state = {}, actions) => {
  switch (actions.type) {
    case FILES_UPDATE_REQUEST:
      return { loading: true };
    case FILES_UPDATE_SUCCESS:
      return { loading: false, success: true };
    case FILES_UPDATE_FAIL:
      return { loading: false, error: actions.payload, success: false };

    default:
      return state;
  }
};

export const filesDeleteReducer = (state = {}, actions) => {
  switch (actions.type) {
    case FILES_DELETE_REQUEST:
      return { loading: true };
    case FILES_DELETE_SUCCESS:
      return { loading: false, success: true };
    case FILES_DELETE_FAIL:
      return { loading: false, error: actions.payload, success: false };

    default:
      return state;
  }
};
