import "./App.css";
import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import ChatPage from "./Pages/chatPage";
import AuthPage from "./Pages/authPage";
import axios from "axios";

function App() {
  axios.defaults.withCredentials = true;
  axios.defaults.baseURL = "http://localhost:8000";
  return (
    <>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/home" element={<ChatPage />} />
      </Routes>
    </>
  );
}

export default App;
