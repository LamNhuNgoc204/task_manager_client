import { useEffect, useRef } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./pages/home";
import AllTasks from "./pages/all_tasks";
import ImportantTasks from "./pages/importants_tasks";
import Completed_tasks from "./pages/completed_tasks";
import IncompletedTasks from "./pages/incompleted_tasks";
import { createElementSnow } from "./animation/snow";
import AuthLayout from "./layout/auth/AuthLayout";
import AuthProvider from "./context/AuthProvider";
import ErrorPage from "./pages/error";
import Setting from "./pages/setting";

function App() {
  const snowContainerRef = useRef(null);

  useEffect(() => {
    createElementSnow(snowContainerRef.current);
  }, []);

  return (
    <div className="relative">
      <div
        ref={snowContainerRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
      ></div>
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route exact path="/" element={<Home />}>
              <Route
                index
                element={<AllTasks />}
                loader={async () => {
                  //lay data o
                  console.log("abc");
                }}
              />
              <Route path="/important-tasks" element={<ImportantTasks />} />
              <Route path="/completed-tasks" element={<Completed_tasks />} />
              <Route path="/incompleted-tasks" element={<IncompletedTasks />} />
              <Route path="/setting" element={<Setting />} />
            </Route>
            <Route path="/auth/:type" element={<AuthLayout />} />
            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
