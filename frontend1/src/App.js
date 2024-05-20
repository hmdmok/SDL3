import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import LandingPage from "./screens/LandingPage/LandingPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dossiers from "./screens/dossiersScreens/Dossiers/Dossiers";
import Login from "./screens/usersScreens/Login/Login";
import AddUser from "./screens/usersScreens/AddUser/AddUser";
import UpdateDossiers from "./screens/dossiersScreens/UpdateDossiers/UpdateDossiers";
import HomeScreen from "./screens/HomeScreen/HomeScreen";
import Users from "./screens/usersScreens/Users/Users";
import ScanDossier from "./screens/dossiersScreens/ScanDossier/ScanDossier";
import AddDemandeur from "./screens/dossiersScreens/AddDemandeur/AddDemandeur";
import UpdateConjoin from "./screens/dossiersScreens/UpdateConjoin/UpdateConjoin";
import EnquetCNL from "./screens/etudesScreens/EnquetCNL/EnquetCNL";
import ListBenifisiaire from "./screens/etudesScreens/ListBenifisiaire/ListBenifisiaire";
import ImportationData from "./screens/setingsScreens/ImportationData/ImportationData";
import Willaya from "./screens/setingsScreens/Willaya/Willaya";
import Commune from "./screens/setingsScreens/Commune/Commune";

import TableNotes from "./screens/setingsScreens/TableNotes/TableNotes";
import Help from "./screens/Help/Help";
import Contact from "./screens/Contact/Contact";
import UpdateUser from "./screens/usersScreens/UpdateUser/UpdateUser";
import UserProfile from "./screens/usersScreens/UserProfile/UserProfile";
import UpdateDemandeur from "./screens/dossiersScreens/UpdateDemandeur/UpdateDemandeur";
import AddConjoin from "./screens/dossiersScreens/AddConjoin/AddConjoin";
import System from "./screens/setingsScreens/System/System";
import ImportationDemPhoto from "./screens/setingsScreens/ImportationDemPhoto/ImportationDemPhoto";

const App = () => (
  <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dossiers" element={<Dossiers />} />
      <Route path="/home" element={<HomeScreen />} />
      <Route path="/system" element={<System />} />
      <Route path="/adddossiers/:id" element={<UpdateDossiers />} />
      <Route path="/scandossier" element={<ScanDossier />} />
      <Route path="/demandeur" element={<AddDemandeur />} />
      <Route path="/demandeur/:id" element={<UpdateDemandeur />} />
      <Route path="/conjoin/:id" element={<AddConjoin />} />
      <Route path="/updateConjoin/:id" element={<UpdateConjoin />} />
      <Route path="/login" element={<Login />} />
      <Route path="/users" element={<Users />} />
      <Route path="/addUser" element={<AddUser />} />
      <Route path="/updateUser/:id" element={<UpdateUser />} />
      <Route path="/userProfile/:id" element={<UserProfile />} />
      <Route path="/enquetCNL" element={<EnquetCNL />} />

      <Route path="/listBenifisiaire" element={<ListBenifisiaire />} />
      <Route path="/importationData" element={<ImportationData />} />
      <Route path="/importationDemPhoto" element={<ImportationDemPhoto />} />
      <Route path="/willaya" element={<Willaya />} />
      <Route path="/commune" element={<Commune />} />
      <Route path="/tableNotes" element={<TableNotes />} />
      <Route path="/help" element={<Help />} />
      <Route path="/contact" element={<Contact />} />
    </Routes>

    <Footer />
  </BrowserRouter>
);
export default App;
