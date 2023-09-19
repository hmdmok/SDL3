import {
  FILES_ADD_TO_LIST,
  FILES_DELETE_FROM_LIST,
} from "../constants/filesConstants";

export const addFile = (file) => async (dispatch, getState) => {
  const {
    filesToCheck: { filesInfo },
  } = getState();
  const { files, filesCount } = filesInfo;
  files.push(file);
  const newFilesInfo = {
    files: files,
    filesCount: filesCount + 1,
  };
  dispatch({ type: FILES_ADD_TO_LIST, payload: newFilesInfo });

  localStorage.setItem("filesInfo", JSON.stringify(newFilesInfo));
};

export const deleteFile = (file) => async (dispatch, getState) => {
  const {
    filesToCheck: { filesInfo },
  } = getState();

  const newFilesInfo = {
    files: filesInfo.files.filter((f) => f._id !== file._id),
    filesCount: filesInfo.filesCount - 1,
  };

  dispatch({ type: FILES_DELETE_FROM_LIST, payload: newFilesInfo });

  localStorage.setItem("filesInfo", JSON.stringify(newFilesInfo));
};
