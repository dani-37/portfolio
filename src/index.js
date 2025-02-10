import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import {
  BrowserRouter,
  useNavigate,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import reportWebVitals from "./reportWebVitals";
import Klere from "./pages/work/Klere.tsx";
import Toolip from "./pages/work/Toolip.tsx";
import Graphext from "./pages/work/Graphext.tsx";
import ReactGA from "react-ga4";
import Footprints from "./pages/projects/Footprints.tsx";
import Movies from "./pages/projects/Movies.tsx";
import Webs from "./pages/projects/Webs.tsx";

function RedirectHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const from404 = urlParams.get("redirectFrom");
    const toPath = urlParams.get("to");

    if (from404 && toPath) {
      urlParams.delete("redirectFrom");
      urlParams.delete("to");
      window.history.replaceState(
        {},
        "",
        window.location.pathname + "?" + urlParams.toString()
      );
      navigate(toPath, { replace: true });
    }
  }, [navigate]);

  return null;
}

ReactGA.initialize("G-8SZZJKC9XT");

function PageTracker() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname });
  }, [location]);

  return null;
}
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <RedirectHandler />
    <PageTracker />
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/klere" element={<Klere />} />
      <Route path="/toolip" element={<Toolip />} />
      <Route path="/graphext" element={<Graphext />} />
      <Route path="/nature-footprints" element={<Footprints />} />
      <Route path="/movie-network" element={<Movies />} />
      <Route path="/web-development" element={<Webs />} />
    </Routes>
  </BrowserRouter>
);

reportWebVitals();
