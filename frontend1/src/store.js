import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  userAddReducer,
  userDeleteReducer,
  userListReducer,
  userLoginReducer,
  userUpdateReducer,
} from "./reducers/userReducers";
import {
  quotaAddReducer,
  quotaDeleteReducer,
  quotaListReducer,
  quotaUpdateReducer,
} from "./reducers/quotaReducers";
import {
  systemAddReducer,
  systemCheckReducer,
  systemUpdateReducer,
} from "./reducers/systemReducers";
import {
  noteAddReducer,
  noteDeleteReducer,
  noteGetReducer,
  noteListReducer,
  noteUpdateReducer,
} from "./reducers/noteReducers";
import {
  wilayaAddReducer,
  wilayaDeleteReducer,
  wilayaGetReducer,
  wilayaListReducer,
  wilayaUpdateReducer,
} from "./reducers/wilayaReducers";
import {
  communeAddReducer,
  communeDeleteReducer,
  communeGetReducer,
  communeGetByWilayaReducer,
  communeListReducer,
  communeUpdateReducer,
} from "./reducers/communeReducers";
import {
  dairaGetByWilayaReducer,
  dairaListReducer,
} from "./reducers/dairaReducers";
import {
  demandeurAddReducer,
  demandeurDeleteReducer,
  demandeurGetReducer,
  demandeurListReducer,
  demandeurUpdateReducer,
} from "./reducers/demandeurReducers";
import {
  dossierAddReducer,
  dossierDeleteReducer,
  dossierGetReducer,
  dossierListReducer,
  dossierUpdateReducer,
} from "./reducers/dossierReducers";
import {
  enquetCNLGetReducer,
  enquetCNASGetReducer,
  enquetCASNOSGetReducer,
  enquetCNLListReducer,
} from "./reducers/enquetCNLReducers";
// import { importationDataReducer } from "./reducers/importationDataReducers";
import { importationFichierReducer } from "./reducers/importationFichierReducers";
import { importationFichierTempReducer } from "./reducers/templatesReducers";
import { validateHeaderReducer } from "./reducers/validateHeaderReducers";
import { filesReducer } from "./reducers/filesReducers";
import {
  benefisiersReducer,
  listBenefisiersReducer,
} from "./reducers/benefisiersReducers";

const reducer = combineReducers({
  userLogin: userLoginReducer,
  userAdd: userAddReducer,
  userList: userListReducer,
  userUpdate: userUpdateReducer,
  userDelete: userDeleteReducer,

  quotaAdd: quotaAddReducer,
  quotaList: quotaListReducer,
  quotaUpdate: quotaUpdateReducer,
  quotaDelete: quotaDeleteReducer,

  filesToCheck: filesReducer,

  filesToBenifits: benefisiersReducer,
  listBenefisiersGet: listBenefisiersReducer,

  importationFichierTemp: importationFichierTempReducer,

  validateHeader: validateHeaderReducer,

  importedFichier: importationFichierReducer,

  systemCheck: systemCheckReducer,
  systemAdd: systemAddReducer,
  systemUpdate: systemUpdateReducer,

  noteAdd: noteAddReducer,
  noteList: noteListReducer,
  noteUpdate: noteUpdateReducer,
  noteDelete: noteDeleteReducer,
  noteGet: noteGetReducer,

  wilayaAdd: wilayaAddReducer,
  wilayaList: wilayaListReducer,
  wilayaUpdate: wilayaUpdateReducer,
  wilayaDelete: wilayaDeleteReducer,
  wilayaGet: wilayaGetReducer,

  communeAdd: communeAddReducer,
  communeList: communeListReducer,
  communeUpdate: communeUpdateReducer,
  communeDelete: communeDeleteReducer,
  communeGet: communeGetReducer,
  communeGetByWilaya: communeGetByWilayaReducer,

  dairaList: dairaListReducer,
  dairaGetByWilaya: dairaGetByWilayaReducer,

  demandeurAdd: demandeurAddReducer,
  demandeurList: demandeurListReducer,
  demandeurUpdate: demandeurUpdateReducer,
  demandeurDelete: demandeurDeleteReducer,
  demandeurGet: demandeurGetReducer,

  dossierAdd: dossierAddReducer,
  dossierList: dossierListReducer,
  dossierUpdate: dossierUpdateReducer,
  dossierDelete: dossierDeleteReducer,
  dossierGet: dossierGetReducer,

  enquetCNLList: enquetCNLListReducer,
  enquetCNLGet: enquetCNLGetReducer,
  enquetCNASGet: enquetCNASGetReducer,
  enquetCASNOSGet: enquetCASNOSGetReducer,
});

const userInfoFromStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

const filesInfoFromStorage = localStorage.getItem("filesInfo")
  ? JSON.parse(localStorage.getItem("filesInfo"))
  : { files: [], filesCount: 0 };

const benefisiersInfoFromStorage = localStorage.getItem("benefisiersInfo")
  ? JSON.parse(localStorage.getItem("benefisiersInfo"))
  : { benefisiers: [] };

const systemInfoFromStorage = localStorage.getItem("systemInfo")
  ? JSON.parse(localStorage.getItem("systemInfo"))
  : null;

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
  systemCheck: { systemInfo: systemInfoFromStorage },
  filesToCheck: { filesInfo: filesInfoFromStorage },
  filesToBenifits: { benefisiersInfo: benefisiersInfoFromStorage },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
