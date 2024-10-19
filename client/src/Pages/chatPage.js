import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const ChatPage = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [receiverId, setReceiverId] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [ws, setWs] = useState(null);
  const userId = "YOUR_USER_ID"; // Replace with actual user ID from your context or state or from auth
  useEffect(() => {
    // Initialize WebSocket connection
    const websocket = new WebSocket("ws://localhost:8000");
    setWs(websocket);

    // Handle incoming messages
    websocket.onmessage = (event) => {
      try {
        const newMessage = JSON.parse(event.data);

        if (
          newMessage.receiver === receiverId ||
          newMessage.sender === receiverId
        ) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      } catch (error) {
        console.error("Received non-JSON message:", event.data);
      }
    };

    // WebSocket error handling
    websocket.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    websocket.onclose = () => {
      console.warn("WebSocket connection closed.");
    };

    // Fetch all users
    const fetchUsers = async () => {
      try {
        const response = await fetch("/v1/user/all");
        const data = await response.json();
        console.log("Users fetched:", data.data.users); // Debugging line
        setUsers(data.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();

    return () => {
      websocket.close();
    };
  }, [receiverId]);

  const sendMessage = async () => {
    if (message.trim() !== "" && receiverId) {
      const messageData = {
        sender: userId,
        receiver: receiverId,
        message,
      };

      try {
        const response = await fetch(`/v1/messages/${receiverId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(messageData),
        });

        if (!response.ok) {
          throw new Error(`Error sending message: ${response.statusText}`);
        }

        // Send the message through WebSocket
        ws.send(JSON.stringify(messageData));

        setMessage(""); // Clear the input field
      } catch (error) {
        console.error(error);
      }
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const response = await fetch(`/v1/messages/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      console.log("Messages fetched for user", userId, ":", data.messages); // Debugging line
      setMessages(data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleUserSelect = (user) => {
    setReceiverId(user.id);
    setSelectedUser(user);
    fetchMessages(user.id); // Fetch messages for the selected user
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/v1/user/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Logout failed");
      window.location.reload();
    } catch (error) {
      alert("Internal Server Error");
      console.error(error);
    }
  };

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Web Socket Whispers
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <button
                  onClick={handleLogout}
                  className="btn btn-outline-light"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-5 pt-5">
        {" "}
        {/* Adjusting for the fixed navbar */}
        <div className="row">
          <div className="col-md-4">
            <ul className="list-group">
              {users.length === 0 ? (
                <li className="list-group-item">No users available</li>
              ) : (
                users.map((user) => (
                  <li
                    key={user.id}
                    className={`list-group-item ${
                      receiverId === user.id ? "active" : ""
                    }`}
                    style={{ cursor: "pointer" }}
                    onClick={() => handleUserSelect(user)}
                  >
                    <div className="d-flex align-items-center">
                      <div className="profile-icon me-3">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>{user.username}</div>
                    </div>
                  </li>
                ))
              )}
            </ul>
          </div>

          {selectedUser ? (
            <div className="col-md-8">
              <div className="card">
                <div className="card-header d-flex align-items-center">
                  <div className="profile-icon me-3">
                    {selectedUser.username.charAt(0).toUpperCase()}
                  </div>
                  <div>{selectedUser.username}</div>
                </div>
                <div
                  className="card-body"
                  style={{ maxHeight: "300px", overflowY: "auto" }}
                >
                  <div id="messageDisplay">
                    {messages.length === 0 ? (
                      <p>No messages yet. Start the conversation!</p>
                    ) : (
                      messages.map((msg, index) => (
                        <p key={index}>
                          <strong>
                            {msg.sender === userId
                              ? "You"
                              : selectedUser.username}
                            :
                          </strong>{" "}
                          {msg.message}
                        </p>
                      ))
                    )}
                  </div>
                </div>
                <div className="card-footer">
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      placeholder="Type the message..."
                    />
                    <button onClick={sendMessage} className="btn btn-primary">
                      Send
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="col-md-8">
              <div className="alert alert-info">
                Select a user to start chatting.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
