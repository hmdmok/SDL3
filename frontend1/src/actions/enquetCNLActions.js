import axios from "axios";
import {
  ENQUETCNL_ADD_FAIL,
  ENQUETCNL_ADD_REQUEST,
  ENQUETCNL_ADD_SUCCESS,
  ENQUETCNL_DELETE_FAIL,
  ENQUETCNL_DELETE_REQUEST,
  ENQUETCNL_DELETE_SUCCESS,
  ENQUETCNL_GET_FAIL,
  ENQUETCNL_GET_REQUEST,
  ENQUETCNL_GET_SUCCESS,
  ENQUETCNL_LIST_FAIL,
  ENQUETCNL_LIST_REQUEST,
  ENQUETCNL_LIST_SUCCESS,
  ENQUETCNL_UPDATE_FAIL,
  ENQUETCNL_UPDATE_REQUEST,
  ENQUETCNL_UPDATE_SUCCESS,
} from "../constants/enquetCNLConstants";

export const listEnquetCNLsAction =
  (fromDate, toDate) => async (dispatch, getState) => {
    try {
      dispatch({
        type: ENQUETCNL_LIST_REQUEST,
      });
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const formData = {
        fromDate,
        toDate,
      };

      const { data } = await axios.post("/api/dossiers/enquetCNLs", formData, config);

      dispatch({
        type: ENQUETCNL_LIST_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ENQUETCNL_LIST_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

// export const addEnquetCNLAction =
//   (
//     creator,
//     id_demandeur,
//     id_conjoin,
//     date_depo,
//     num_dos,
//     num_enf,
//     stuation_s_avec_d,
//     stuation_s_andicap,
//     stuation_d,
//     numb_p,
//     type,
//     gender_conj,
//     remark,
//     saisi_conj,
//     scan_enquetCNL
//   ) =>
//   async (dispatch, getState) => {
//     try {
//       dispatch({ type: ENQUETCNL_ADD_REQUEST });
//       const {
//         userLogin: { userInfo },
//       } = getState();

//       const config = {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${userInfo.token}`,
//         },
//       };

//       const formData = {
//         creator,
//         id_demandeur,
//         id_conjoin,
//         date_depo,
//         num_dos,
//         num_enf,
//         stuation_s_avec_d,
//         stuation_s_andicap,
//         stuation_d,
//         numb_p,
//         type,
//         gender_conj,
//         remark,
//         saisi_conj,
//         scan_enquetCNL,
//       };

//       const data = await axios.post("/api/enquetCNLs/create", formData, config);

//       dispatch({ type: ENQUETCNL_ADD_SUCCESS, payload: data });
//     } catch (error) {
//       dispatch({
//         type: ENQUETCNL_ADD_FAIL,
//         payload:
//           error.response && error.response.data.message
//             ? error.response.data.message
//             : error.message,
//       });
//     }
//   };

// export const getEnquetCNLAction = (id) => async (dispatch, getState) => {
//   try {
//     dispatch({
//       type: ENQUETCNL_GET_REQUEST,
//     });

//     const { data } = await axios.get(`/api/enquetCNLs/${id}`);

//     dispatch({
//       type: ENQUETCNL_GET_SUCCESS,
//       payload: data,
//     });
//   } catch (error) {
//     dispatch({
//       type: ENQUETCNL_GET_FAIL,
//       payload:
//         error.response && error.response.data.message
//           ? error.response.data.message
//           : error.message,
//     });
//   }
// };

// export const updateEnquetCNLAction =
//   (
//     id,
//     creator,
//     id_demandeur,
//     id_conjoin,
//     date_depo,
//     num_dos,
//     num_enf,
//     stuation_s_avec_d,
//     stuation_s_andicap,
//     stuation_d,
//     numb_p,
//     type,
//     gender_conj,
//     remark,
//     saisi_conj,
//     scan_enquetCNL
//   ) =>
//   async (dispatch, getState) => {
//     try {
//       dispatch({ type: ENQUETCNL_UPDATE_REQUEST });
//       const {
//         userLogin: { userInfo },
//       } = getState();

//       const config = {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${userInfo.token}`,
//         },
//       };

//       const formData = {
//         creator,
//         id_demandeur,
//         id_conjoin,
//         date_depo,
//         num_dos,
//         num_enf,
//         stuation_s_avec_d,
//         stuation_s_andicap,
//         stuation_d,
//         numb_p,
//         type,
//         gender_conj,
//         remark,
//         saisi_conj,
//         scan_enquetCNL,
//       };

//       const { data } = await axios.put(
//         `/api/enquetCNLs/${id}`,
//         formData,
//         config
//       );
//       dispatch({ type: ENQUETCNL_UPDATE_SUCCESS, payload: data });
//     } catch (error) {
//       dispatch({
//         type: ENQUETCNL_UPDATE_FAIL,
//         payload:
//           error.response && error.response.data.message
//             ? error.response.data.message
//             : error.message,
//       });
//     }
//   };

// export const deleteEnquetCNLAction = (id) => async (dispatch, getState) => {
//   try {
//     dispatch({ type: ENQUETCNL_DELETE_REQUEST });

//     const {
//       userLogin: { userInfo },
//     } = getState();

//     const config = {
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${userInfo.token}`,
//       },
//     };

//     const { data } = await axios.delete(`/api/enquetCNLs/${id}`, config);
//     dispatch({ type: ENQUETCNL_DELETE_SUCCESS, payload: data });
//   } catch (error) {
//     dispatch({
//       type: ENQUETCNL_DELETE_FAIL,
//       payload:
//         error.response && error.response.data.message
//           ? error.response.data.message
//           : error.message,
//     });
//   }
// };
