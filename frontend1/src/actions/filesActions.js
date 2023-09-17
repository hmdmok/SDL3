import axios from "axios";
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

export const add = (fileID, numDoss) => async (dispatch, getState) => {
  try {
    dispatch({ type: FILES_ADD_REQUEST });
    const {
      filesInfoFromStorage: { filesInfo },
    } = getState();

    const newFilesInfo = {
      files: filesInfo.files.append({ fileID, numDoss }),
      filesCount: filesInfo.filesCount + 1,
    };
    
    dispatch({ type: FILES_ADD_SUCCESS, payload: newFilesInfo });

    localStorage.setItem("filesInfo", JSON.stringify(filesInfo));
  } catch (error) {
    dispatch({
      type: FILES_ADD_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const listUsers = () => async (dispatch, getState) => {
  try {
    dispatch({
      type: FILES_LIST_REQUEST,
    });

    const {
      filesLogin: { filesInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${filesInfo.token}`,
      },
    };

    const { data } = await axios.get("/api/filess", config);

    dispatch({
      type: FILES_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: FILES_LIST_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const update =
  (
    id,
    firstname,
    filesname,
    lastname,
    filestype,
    password,
    birthday,
    creator,
    remark,
    email,
    phone,
    photo_link,
    photo_file
  ) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: FILES_UPDATE_REQUEST });
      const {
        filesLogin: { filesInfo },
      } = getState();

      if (photo_file) {
        const config = {
          headers: {
            Authorization: `Bearer ${filesInfo.token}`,
          },
        };

        const formData = new FormData();
        formData.append("firstname", firstname);
        formData.append("filesname", filesname);
        formData.append("lastname", lastname);
        formData.append("filestype", filestype);
        formData.append("password", password);
        formData.append("birthday", birthday);
        formData.append("creator", creator);
        formData.append("remark", remark);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("photo_link", photo_file);
        const { data } = await axios.put(`/api/filess/${id}`, formData, config);
        dispatch({ type: FILES_UPDATE_SUCCESS, payload: data });
      } else {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${filesInfo.token}`,
          },
        };
        const { data } = await axios.put(
          `/api/filess/${id}`,
          {
            firstname: firstname,
            filesname: filesname,
            lastname: lastname,
            filestype: filestype,
            password: password,
            birthday: birthday,
            creator: creator,
            remark: remark,
            email: email,
            phone: phone,
            photo_link: photo_link,
          },
          config
        );
        dispatch({ type: FILES_UPDATE_SUCCESS, payload: data });
      }

      localStorage.setItem("filesInfo", JSON.stringify(filesInfo));
    } catch (error) {
      dispatch({
        type: FILES_UPDATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const deleteUserAction = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: FILES_DELETE_REQUEST });

    const {
      filesLogin: { filesInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${filesInfo.token}`,
      },
    };
    if (filesInfo._id !== id) {
      const { data } = await axios.delete(`/api/filess/${id}`, config);
      dispatch({ type: FILES_DELETE_SUCCESS, payload: data });

      localStorage.setItem("filesInfo", JSON.stringify(filesInfo));
    } else {
      dispatch({
        type: FILES_DELETE_FAIL,
        payload: "لا يمكنك حذف المستخدم الخاص بك",
      });
    }
  } catch (error) {
    dispatch({
      type: FILES_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
