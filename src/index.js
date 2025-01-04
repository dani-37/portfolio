import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
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
      // Clear the query params before navigating
      urlParams.delete("redirectFrom");
      urlParams.delete("to");

      // Replace the URL so the user doesn’t see the query params
      window.history.replaceState(
        {},
        "",
        window.location.pathname + "?" + urlParams.toString()
      );

      // Then navigate to the intended path
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
