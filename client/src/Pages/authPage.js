import React, { useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    if (loginData.email.trim() === "" || loginData.password.trim() === "") {
      alert("Please fill in all the required fields.");
      return;
    }

    try {
      const response = await axios.post("/v1/user/login", {
        email: loginData.email,
        password: loginData.password,
      });

      if (response.status === 200) {
        alert("Login successful!");

        window.location.reload();
      }
    } catch (error) {
      alert(
        "Login failed: " +
          (error.response?.data?.message || "Internal Server Error")
      );
    }
  };

  const handleSignupSubmit = async (event) => {
    event.preventDefault();
    const { name, email, password, confirmPassword } = signupData;

    if (
      name.trim() === "" ||
      email.trim() === "" ||
      password.trim() === "" ||
      confirmPassword.trim() === ""
    ) {
      alert("Please fill in all the required fields.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.post("/v1/user/signup", {
        name,
        email,
        password,
      });

      if (response.status === 201) {
        alert("Signup successful!");

        window.location.reload();
      }
    } catch (error) {
      alert(
        "Signup failed: " +
          (error.response?.data?.message || "Internal Server Error")
      );
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-light bg-primary">
        <div className="container">
          <a className="navbar-brand text-white" href="#">
            Web Socket Whispers
          </a>
        </div>
      </nav>
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <ul className="nav nav-tabs card-header-tabs">
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === "login" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("login")}
                    >
                      Login
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link ${
                        activeTab === "signup" ? "active" : ""
                      }`}
                      onClick={() => setActiveTab("signup")}
                    >
                      Sign Up
                    </button>
                  </li>
                </ul>
              </div>
              <div className="card-body">
                {activeTab === "login" ? (
                  <form onSubmit={handleLoginSubmit}>
                    <div className="mb-3">
                      <label htmlFor="loginEmail" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="loginEmail"
                        placeholder="Enter your email"
                        value={loginData.email}
                        onChange={(e) =>
                          setLoginData({ ...loginData, email: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="loginPassword" className="form-label">
                        Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="loginPassword"
                        placeholder="Enter your password"
                        value={loginData.password}
                        onChange={(e) =>
                          setLoginData({
                            ...loginData,
                            password: e.target.value,
                          })
                        }
                      />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">
                      Login
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleSignupSubmit}>
                    <div className="mb-3">
                      <label htmlFor="signupName" className="form-label">
                        Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="signupName"
                        placeholder="Enter your name"
                        value={signupData.name}
                        onChange={(e) =>
                          setSignupData({ ...signupData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="signupEmail" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="signupEmail"
                        placeholder="Enter your email"
                        value={signupData.email}
                        onChange={(e) =>
                          setSignupData({
                            ...signupData,
                            email: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="signupPassword" className="form-label">
                        Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="signupPassword"
                        placeholder="Enter your password"
                        value={signupData.password}
                        onChange={(e) =>
                          setSignupData({
                            ...signupData,
                            password: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="confirmPassword" className="form-label">
                        Confirm Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="confirmPassword"
                        placeholder="Confirm your password"
                        value={signupData.confirmPassword}
                        onChange={(e) =>
                          setSignupData({
                            ...signupData,
                            confirmPassword: e.target.value,
                          })
                        }
                      />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block">
                      Sign Up
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
