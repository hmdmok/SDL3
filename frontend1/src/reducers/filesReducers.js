import {
  FILES_ADD_TO_LIST,
  FILES_DELETE_FROM_LIST,
   DELETE_LIST,
  LIST_ADD_TO_LIST,
} from "../constants/filesConstants";

export const filesReducer = (state = {}, actions) => {
  switch (actions.type) {
    case FILES_ADD_TO_LIST:
      return {
        filesInfo: actions.payload,
      };

    case LIST_ADD_TO_LIST:
      return {
        filesInfo: actions.payload,
      };

    case FILES_DELETE_FROM_LIST:
      return {
        filesInfo: actions.payload,
      };

    case DELETE_LIST:
      return {
        filesInfo: actions.payload,
      };

    default:
      return state;
  }
};
