import axios from "axios";
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

export const addNoteAction = (notes, code, nom) => async (dispatch, getState) => {
  try {
    dispatch({ type: NOTE_ADD_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const formData = { notes, code, nom };

    const data  = await axios.post("/api/notes/create", formData, config);

    dispatch({ type: NOTE_ADD_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: NOTE_ADD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listNotesAction = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: NOTE_LIST_REQUEST,
    });

    const { data } = await axios.get("/api/notes");

    dispatch({
      type: NOTE_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: NOTE_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getNoteAction = (id) => async (dispatch, getState) => {
  try {
    dispatch({
      type: NOTE_GET_REQUEST,
    });

    const { data } = await axios.get(`/api/notes/${id}`);

    dispatch({
      type: NOTE_GET_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: NOTE_GET_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updateNoteAction = (id, notes, code, nom) => async (dispatch, getState) => {
  try {
    dispatch({ type: NOTE_UPDATE_REQUEST });
    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const formData = { notes, code, nom };
    const { data } = await axios.put(`/api/notes/${id}`, formData, config);
    dispatch({ type: NOTE_UPDATE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: NOTE_UPDATE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const deleteNoteAction = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: NOTE_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.delete(`/api/notes/${id}`, config);
    dispatch({ type: NOTE_DELETE_SUCCESS, payload: data });
  } catch (error) {
    dispatch({
      type: NOTE_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
