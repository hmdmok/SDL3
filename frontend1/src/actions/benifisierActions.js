import {
  FILES_ADD_TO_BENEFISIER_LIST,
  FILES_DELETE_FROM_BENEFISIER_LIST,
  LIST_ADD_TO_BENEFISIER_LIST,
  DELETE_BENEFISIER_LIST,
} from "../constants/benifisierConstants";

export const addBenefisier = (file) => async (dispatch, getState) => {
  const {
    filesToBenifits: { benefisiersInfo },
  } = getState();

  const { benefisiers } = benefisiersInfo;

  benefisiers.push(file);
  const newBenefisiersInfo = {
    benefisiers: benefisiers,
  };
  dispatch({ type: FILES_ADD_TO_BENEFISIER_LIST, payload: newBenefisiersInfo });

  localStorage.setItem("benefisiersInfo", JSON.stringify(newBenefisiersInfo));
};

export const addBenefisierList = (list) => async (dispatch, getState) => {
  const {
    filesToBenifits: { benefisiersInfo },
  } = getState();

  const { benefisiers } = benefisiersInfo;

  let newBenefisiers = [...benefisiers];

  if (benefisiers.length > 0)
    // eslint-disable-next-line array-callback-return
    list.map((mapedFile) => {
      // eslint-disable-next-line array-callback-return

      if (!benefisiers.includes(mapedFile)) {
        newBenefisiers.push(mapedFile);
      }
    });
  else newBenefisiers = list;

  const newBenefisiersInfo = {
    benefisiers: newBenefisiers,
  };
  dispatch({ type: LIST_ADD_TO_BENEFISIER_LIST, payload: newBenefisiersInfo });

  localStorage.setItem("benefisiersInfo", JSON.stringify(newBenefisiersInfo));
};

export const deleteBenefisier = (file) => async (dispatch, getState) => {
  const {
    filesToBenifits: { benefisiersInfo },
  } = getState();

  const newBenefisiersInfo = {
    benefisiers: benefisiersInfo.benefisiers.filter((f) => f._id !== file._id),
  };

  dispatch({
    type: FILES_DELETE_FROM_BENEFISIER_LIST,
    payload: newBenefisiersInfo,
  });

  localStorage.setItem("benefisiersInfo", JSON.stringify(newBenefisiersInfo));
};

export const deleteBenefisierList = () => async (dispatch, getState) => {
  const newBenefisiersInfo = {
    benefisiers: [],
  };

  dispatch({ type: DELETE_BENEFISIER_LIST, payload: newBenefisiersInfo });

  localStorage.setItem("benefisiersInfo", JSON.stringify(newBenefisiersInfo));
};
