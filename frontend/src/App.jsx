import { lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout/Layout";
const WelcomePage = lazy(() => import("./pages/WelcomePage/WelcomePage"));

import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<WelcomePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
