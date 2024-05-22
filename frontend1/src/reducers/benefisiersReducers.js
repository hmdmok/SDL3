import {
  FILES_ADD_TO_BENEFISIER_LIST,
  FILES_DELETE_FROM_BENEFISIER_LIST,
  DELETE_BENEFISIER_LIST,
  LIST_ADD_TO_BENEFISIER_LIST,
  LIST_BENEFISIERS_GET_FAIL,
  LIST_BENEFISIERS_GET_REQUEST,
  LIST_BENEFISIERS_GET_SUCCESS,
} from "../constants/benifisierConstants";

export const benefisiersReducer = (state = {}, actions) => {
  switch (actions.type) {
    case FILES_ADD_TO_BENEFISIER_LIST:
      return {
        benefisiersInfo: actions.payload,
      };

    case LIST_ADD_TO_BENEFISIER_LIST:
      return {
        benefisiersInfo: actions.payload,
      };

    case FILES_DELETE_FROM_BENEFISIER_LIST:
      return {
        benefisiersInfo: actions.payload,
      };

    case DELETE_BENEFISIER_LIST:
      return {
        benefisiersInfo: actions.payload,
      };

    default:
      return state;
  }
};

export const listBenefisiersReducer = (state = {}, actions) => {
  switch (actions.type) {
    case LIST_BENEFISIERS_GET_REQUEST:
      return { loading: true };
    case LIST_BENEFISIERS_GET_SUCCESS:
      return {
        loading: false,
        listBenefisiers: actions.payload,
        success: true,
      };
    case LIST_BENEFISIERS_GET_FAIL:
      return { loading: false, error: actions.payload };

    default:
      return state;
  }
};
