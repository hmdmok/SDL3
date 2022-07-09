import "./App.css";
import "./bootstrap.min.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import LandingPage from "./screens/LandingPage/LandingPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dossiers from "./screens/Dossiers/Dossiers";
import Login from "./screens/Login/Login";
import AddUser from "./screens/AddUser/AddUser";
import AddDossiers from "./screens/AddDossiers/AddDossiers";
import HomeScreen from "./screens/HomeScreen/HomeScreen";

const App = () => (
  <BrowserRouter>
    <Header />
    {/* a;sdjlkjlkj */}
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dossiers" element={<Dossiers />} />
      <Route path="/home" element={<HomeScreen />} />
      <Route path="/adddossiers" element={<AddDossiers />} />
      <Route path="/login" element={<Login />} />
      <Route path="/addUser" element={<AddUser />} />
    </Routes>

    <Footer />
  </BrowserRouter>
);
export default App;
