import {
  FILES_ADD_TO_LIST,
  FILES_DELETE_FROM_LIST,
  LIST_ADD_TO_LIST,
  DELETE_LIST,
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

export const addList = (list) => async (dispatch, getState) => {
  const {
    filesToCheck: { filesInfo },
  } = getState();

  const { files } = filesInfo;
  let newFiles = [...files];
  if (files.length > 0)
    // eslint-disable-next-line array-callback-return
    list.map((mapedFile) => {
      // eslint-disable-next-line array-callback-return

      if (!files.includes(mapedFile)) {
        newFiles.push(mapedFile);
      }
    });
  else newFiles = list;

  const newFilesInfo = {
    files: newFiles,
  };
  dispatch({ type: LIST_ADD_TO_LIST, payload: newFilesInfo });

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

export const deleteList = () => async (dispatch, getState) => {
  const newFilesInfo = {
    files: [],
  };

  dispatch({ type: DELETE_LIST, payload: newFilesInfo });

  localStorage.setItem("filesInfo", JSON.stringify(newFilesInfo));
};
