import axios from "axios";
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

export const login = (username, password) => async (dispatch) => {
  try {
    dispatch({ type: USER_LOGIN_REQUEST });

    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };

    const { data } = await axios.post(
      "/api/users/login",
      { username, password },
      config
    );
    dispatch({ type: USER_LOGIN_SUCCESS, payload: data });
    localStorage.setItem("userInfo", JSON.stringify(data));
  } catch (error) {
    dispatch({
      type: USER_LOGIN_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const logout = () => async (dispatch) => {
  localStorage.removeItem("userInfo");
  dispatch({ type: USER_LOGOUT });
};

export const add =
  (
    firstname,
    username,
    lastname,
    usertype,
    password,
    birthday,
    creator,
    remark,
    email,
    phone,
    photo_file
  ) =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: USER_ADD_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const formData = new FormData();
      formData.append("firstname", firstname);
      formData.append("username", username);
      formData.append("lastname", lastname);
      formData.append("usertype", usertype);
      formData.append("password", password);
      formData.append("birthday", birthday);
      formData.append("creator", creator);
      formData.append("remark", remark);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("photo_link", photo_file);

      const { data } = await axios.post("/api/users", formData, config);

      dispatch({ type: USER_ADD_SUCCESS, payload: data });

      dispatch({ type: USER_LOGIN_SUCCESS, payload: userInfo });
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    } catch (error) {
      dispatch({
        type: USER_ADD_FAIL,
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
      type: USER_LIST_REQUEST,
    });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    const { data } = await axios.get("/api/users", config);

    dispatch({
      type: USER_LIST_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: USER_LIST_FAIL,
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
    username,
    lastname,
    usertype,
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
      dispatch({ type: USER_UPDATE_REQUEST });
      const {
        userLogin: { userInfo },
      } = getState();

      if (photo_file) {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };

        const formData = new FormData();
        formData.append("firstname", firstname);
        formData.append("username", username);
        formData.append("lastname", lastname);
        formData.append("usertype", usertype);
        formData.append("password", password);
        formData.append("birthday", birthday);
        formData.append("creator", creator);
        formData.append("remark", remark);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("photo_link", photo_file);
        const { data } = await axios.put(`/api/users/${id}`, formData, config);
        dispatch({ type: USER_UPDATE_SUCCESS, payload: data });
      } else {
        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.put(
          `/api/users/${id}`,
          {
            firstname: firstname,
            username: username,
            lastname: lastname,
            usertype: usertype,
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
        dispatch({ type: USER_UPDATE_SUCCESS, payload: data });
      }

      dispatch({ type: USER_LOGIN_SUCCESS, payload: userInfo });
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    } catch (error) {
      dispatch({
        type: USER_UPDATE_FAIL,
        payload:
          error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
      });
    }
  };

export const deleteUserAction = (id) => async (dispatch, getState) => {
  try {
    dispatch({ type: USER_DELETE_REQUEST });

    const {
      userLogin: { userInfo },
    } = getState();

    const config = {
      headers: {
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    if (userInfo._id !== id) {
      const { data } = await axios.delete(`/api/users/${id}`, config);
      dispatch({ type: USER_DELETE_SUCCESS, payload: data });

      dispatch({ type: USER_LOGIN_SUCCESS, payload: userInfo });
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    } else {
      dispatch({
        type: USER_DELETE_FAIL,
        payload: "لا يمكنك حذف المستخدم الخاص بك",
      });
    }
  } catch (error) {
    dispatch({
      type: USER_DELETE_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};
