import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  Navigate,
} from "react-router-dom";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import JournalDashboard from "./components/JournalDashboard";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("authToken") || null);
  const [username, setUsername] = useState(
    localStorage.getItem("username") || null
  );

  const handleLogin = (token, username) => {
    setToken(token);
    setUsername(username);
    localStorage.setItem("authToken", token);
    localStorage.setItem("username", username);
  };

  const handleLogout = () => {
    setToken(null);
    setUsername(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("username");
  };

  return (
    <Router>
      <div>
        <nav>
          {!token ? (
            <Link to="/login-register">Login/Register</Link>
          ) : (
            <>
              <Link to="/journals">My Journal</Link> |{" "}
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
        </nav>

        <Routes>
          <Route
            path="/login-register"
            element={
              token ? (
                <Navigate to="/journals" />
              ) : (
                <RegisterForm onRegisterSuccess={handleLogin} />
              )
            }
          />
          <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
          <Route
            path="/journals"
            element={
              token ? (
                <JournalDashboard username={username} token={token} />
              ) : (
                <Navigate to="/login-register" />
              )
            }
          />
          <Route path="/" element={<Navigate to="/login-register" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
