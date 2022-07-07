import {
  USER_ADD_FAIL,
  USER_ADD_REQUEST,
  USER_ADD_SUCCESS,
  USER_DELETE_FAIL,
  USER_DELETE_REQUEST,
  USER_DELETE_SUCCESS,
  USER_LIST_FAIL,
  USER_LIST_REQUEST,
  USER_LIST_SUCCESS,
  USER_LOGIN_FAIL,
  USER_LOGIN_REQUEST,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT,
  USER_UPDATE_FAIL,
  USER_UPDATE_REQUEST,
  USER_UPDATE_SUCCESS,
} from "../constants/userConstants";

export const userLoginReducer = (state = {}, actions) => {
  switch (actions.type) {
    case USER_LOGIN_REQUEST:
      return { loading: true };
    case USER_LOGIN_SUCCESS:
      return { loading: false, userInfo: actions.payload };
    case USER_LOGIN_FAIL:
      return { loading: false, error: actions.payload };
    case USER_LOGOUT:
      return {};

    default:
      return state;
  }
};

export const userAddReducer = (state = {}, actions) => {
  switch (actions.type) {
    case USER_ADD_REQUEST:
      return { loading: true };
    case USER_ADD_SUCCESS:
      return { loading: false, userInfo: actions.payload };
    case USER_ADD_FAIL:
      return { loading: false, error: actions.payload };

    default:
      return state;
  }
};

export const userListReducer = (state = { users: [] }, actions) => {
  switch (actions.type) {
    case USER_LIST_REQUEST:
      return { loading: true };
    case USER_LIST_SUCCESS:
      return { loading: false, users: actions.payload };
    case USER_LIST_FAIL:
      return { loading: false, error: actions.payload };

    default:
      return state;
  }
};

export const userUpdateReducer = (state = {}, actions) => {
  switch (actions.type) {
    case USER_UPDATE_REQUEST:
      return { loading: true };
    case USER_UPDATE_SUCCESS:
      return { loading: false, success: true };
    case USER_UPDATE_FAIL:
      return { loading: false, error: actions.payload, success: false };

    default:
      return state;
  }
};

export const userDeleteReducer = (state = {}, actions) => {
  switch (actions.type) {
    case USER_DELETE_REQUEST:
      return { loading: true };
    case USER_DELETE_SUCCESS:
      return { loading: false, success: true };
    case USER_DELETE_FAIL:
      return { loading: false, error: actions.payload, success: false };

    default:
      return state;
  }
};
