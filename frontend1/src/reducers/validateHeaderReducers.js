import {
  VALIDATE_HEADER_SUCCESS,
  VALIDATE_HEADER_REQUEST,
  VALIDATE_HEADER_FAIL,
} from "../constants/validateHeaderConstants";

export const validateHeaderReducer = (state = {}, actions) => {
  switch (actions.type) {
    case VALIDATE_HEADER_REQUEST:
      return { loading: true };
    case VALIDATE_HEADER_SUCCESS:
      return { loading: false, success: true, status: actions.payload };
    case VALIDATE_HEADER_FAIL:
      return { loading: false, error: actions.payload, success: false };

    default:
      return state;
  }
};
