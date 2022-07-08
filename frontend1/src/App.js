import "./App.css";
import "./bootstrap.min.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import LandingPage from "./screens/LandingPage/LandingPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Dossiers from "./screens/Dossiers/Dossiers";
import Login from "./screens/Login/Login";

const App = () => (
  <BrowserRouter>
    <Header />
{/* a;sdjlkjlkj */}
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dossiers" element={<Dossiers />} />
      <Route path="/login" element={<Login />} />
    </Routes>

    <Footer />
  </BrowserRouter>
);
export default App;
