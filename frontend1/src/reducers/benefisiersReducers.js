import {
  FILES_ADD_TO_BENEFISIER_LIST,
  FILES_DELETE_FROM_BENEFISIER_LIST,
  DELETE_BENEFISIER_LIST,
  LIST_ADD_TO_BENEFISIER_LIST,
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
