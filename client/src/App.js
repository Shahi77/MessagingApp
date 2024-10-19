import "./App.css";
import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ChatPage from "./Pages/chatPage";
import AuthPage from "./Pages/authPage";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <ChatPage />
              ) : (
                <AuthPage setIsLoggedIn={setIsLoggedIn} />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
