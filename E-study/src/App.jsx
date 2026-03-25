import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Tasks from "./pages/Tasks";
import Schedule from "./pages/Schedule";
import Pomodoro from "./pages/Pomodoro";
import Login from "./pages/Login";
import RegisterPage from "./pages/Register";
import Settings from "./pages/Settings";
import Home from "./components/Home";
import About from "./pages/About";
import Account from "./pages/Account";
import PrivateRoute from "./components/PriveteRoute";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/pomodoro" element={<Pomodoro />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/about" element={<About />} />
          <Route path="/account" element={<Account />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
