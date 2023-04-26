import {
  VALIDATE_HEADER_REQUEST,
  VALIDATE_HEADER_SUCCESS,
  VALIDATE_HEADER_FAIL,
} from "../constants/validateHeaderConstants";
import { validateHeader } from "../Functions/functions";

export const validateHeaderAction =
  (file, expectedHeader) => async (dispatch) => {
    try {
      dispatch({ type: VALIDATE_HEADER_REQUEST });
      const status = await validateHeader(file, expectedHeader);

      dispatch({ type: VALIDATE_HEADER_SUCCESS, payload: status });
    } catch (error) {
      dispatch({
        type: VALIDATE_HEADER_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };
