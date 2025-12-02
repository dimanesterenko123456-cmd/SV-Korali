import { lazy, Suspense } from "react";
import "./App.css";
const WelcomePage = lazy(() => import("./components/WelcomePage/WelcomePage"));

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Suspense fallback={<Loader />}>
            <Route index element={<WelcomePage />} />
          </Suspense>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
