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

const reducer = combineReducers({
  userLogin: userLoginReducer,
  userAdd: userAddReducer,
  userList: userListReducer,
  userUpdate: userUpdateReducer,
  userDelete: userDeleteReducer,

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

const initialState = {
  userLogin: { userInfo: userInfoFromStorage },
};

const middleware = [thunk];

const store = createStore(
  reducer,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
