import React, {useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import reportWebVitals from './reportWebVitals';

function RedirectHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const from404 = urlParams.get("redirectFrom");
    const toPath = urlParams.get("to");

    if (from404 && toPath) {
      urlParams.delete("redirectFrom");
      urlParams.delete("to");
      window.history.replaceState({}, "", window.location.pathname + "?" + urlParams.toString());
      navigate(toPath, { replace: true });
    }
  }, [navigate]);

  return null;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <RedirectHandler />
    <App />
  </BrowserRouter>
);

reportWebVitals();
