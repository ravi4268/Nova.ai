import React, { useEffect, useRef, useState } from "react";
import "./styles.css";

import Images from "./pages/Images";
import Subscription from "./pages/Subscription";

const API_URL = "http://localhost:5000";

function App() {
  // =========================================
  // LOGIN
  // =========================================

  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("isLoggedIn") === "true"
  );

  // =========================================
  // SIDEBAR + PAGE
  // =========================================

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [page, setPage] = useState("chat");

  // =========================================
  // IMPORTANT NAVIGATION FUNCTION
  // =========================================

  const navigateTo = (newPage) => {
    setPage(newPage);
    setSidebarOpen(false);
  };

  // =========================================
  // CHAT STATES
  // =========================================

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState(() => {
    try {
      const saved = localStorage.getItem("novaMessages");

      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      return [];
    }
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [preview, setPreview] = useState(null);

  const [sending, setSending] = useState(false);

  const [backendError, setBackendError] = useState("");

  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // =========================================
  // SAVE CHAT
  // =========================================

  useEffect(() => {
    localStorage.setItem(
      "novaMessages",
      JSON.stringify(messages)
    );
  }, [messages]);

  // =========================================
  // LOGIN
  // =========================================

  const login = (e) => {
    e.preventDefault();

    localStorage.setItem("isLoggedIn", "true");

    setIsLoggedIn(true);

    setPage("chat");
  };

  // =========================================
  // LOGOUT
  // =========================================

  const logout = () => {
    localStorage.removeItem("isLoggedIn");

    setIsLoggedIn(false);

    setSidebarOpen(false);

    setPage("chat");
  };

  // =========================================
  // NEW CHAT
  // =========================================

  const newChat = () => {
    setMessages([]);

    setMessage("");

    setSelectedImage(null);

    setSelectedFile(null);

    setPreview(null);

    setBackendError("");

    setPage("chat");

    setSidebarOpen(false);

    localStorage.removeItem("novaMessages");
  };

  // =========================================
  // IMAGE SELECT
  // =========================================

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    setSelectedImage(file);

    setSelectedFile(null);

    const imageUrl = URL.createObjectURL(file);

    setPreview(imageUrl);
  };

  // =========================================
  // FILE SELECT
  // =========================================

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setSelectedFile(file);

    setSelectedImage(null);

    setPreview(null);
  };

  // =========================================
  // REMOVE ATTACHMENT
  // =========================================

  const removeAttachment = () => {
    setSelectedImage(null);

    setSelectedFile(null);

    setPreview(null);

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =========================================
  // SEND MESSAGE
  // =========================================

  const sendMessage = async () => {
    if (
      !message.trim() &&
      !selectedImage &&
      !selectedFile
    ) {
      return;
    }

    const userMessage = message.trim();

    const imageToSend = selectedImage;
    const fileToSend = selectedFile;

    const tempId = Date.now();

    // Temporary message
    const tempMessage = {
      id: tempId,

      user: userMessage,

      ai: "Thinking...",

      imagePreview: imageToSend
        ? URL.createObjectURL(imageToSend)
        : null,

      imageName: imageToSend
        ? imageToSend.name
        : null,

      fileName: fileToSend
        ? fileToSend.name
        : null,

      imageUrl: null,

      uploadedFileUrl: null,

      uploadedFileName: null,
    };

    setMessages((prev) => [
      ...prev,
      tempMessage,
    ]);

    // Clear input
    setMessage("");

    setSelectedImage(null);

    setSelectedFile(null);

    setPreview(null);

    setSending(true);

    setBackendError("");

    try {
      const formData = new FormData();

      formData.append(
        "message",
        userMessage
      );

      if (imageToSend) {
        formData.append(
          "image",
          imageToSend
        );
      }

      if (fileToSend) {
        formData.append(
          "file",
          fileToSend
        );
      }

      const response = await fetch(
        `${API_URL}/api/chat`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error(
          `Server error: ${response.status}`
        );
      }

      const data =
        await response.json();

      setMessages((prev) => {
        return prev.map((item) => {
          if (item.id !== tempId) {
            return item;
          }

          return {
            ...item,

            ai:
              data.reply ||
              "I'm fine 😊",

            imageUrl:
              data.image?.url || null,

            uploadedFileUrl:
              data.file?.url || null,

            uploadedFileName:
              data.file?.name || null,
          };
        });
      });
    } catch (error) {
      console.error(
        "Backend Error:",
        error
      );

      setBackendError(
        "Backend connection failed. Make sure server.js is running on port 5000."
      );

      setMessages((prev) => {
        return prev.map((item) => {
          if (item.id !== tempId) {
            return item;
          }

          return {
            ...item,

            ai:
              "❌ Backend se connection nahi ho pa raha. Please server.js check karein.",
          };
        });
      });
    } finally {
      setSending(false);
    }
  };

  // =========================================
  // ENTER SEND
  // =========================================

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();

      sendMessage();
    }
  };

  // =========================================
  // LOGIN SCREEN
  // =========================================

  if (!isLoggedIn) {
    return (
      <div className="login-screen">

        <div className="login-card">

          <div className="login-logo">

            <div className="logo-box">
              N
            </div>

            <div>
              <h1>
                Nova<span>.AI</span>
              </h1>

              <p>
                Intelligent Assistant
              </p>
            </div>

          </div>

          <h2>
            Welcome Back 👋
          </h2>

          <p className="login-subtitle">
            Login to continue to Nova AI
          </p>

          <form onSubmit={login}>

            <label>
              Email
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              required
            />

            <label>
              Password
            </label>

            <input
              type="password"
              placeholder="Enter your password"
              required
            />

            <button
              className="login-button"
              type="submit"
            >
              Login to Nova AI →
            </button>

          </form>

          <p className="powered">
            ⚡ Powered by Nova.AI
          </p>

        </div>

      </div>
    );
  }

  // =========================================
  // MAIN WEBSITE
  // =========================================

  return (
    <div className="website">

      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <div
          className="overlay"
          onClick={() =>
            setSidebarOpen(false)
          }
        />
      )}

      {/* =====================================
          SIDEBAR
      ===================================== */}

      <aside
        className={`sidebar ${
          sidebarOpen ? "open" : ""
        }`}
      >

        {/* BRAND */}

        <div className="brand">

          <div className="brand-icon">
            N
          </div>

          <h2>
            Nova<span>.AI</span>
          </h2>

        </div>

        {/* NEW CHAT */}

        <button
          className="new-chat"
          onClick={newChat}
        >
          ＋ New Chat
        </button>

        {/* NAVIGATION */}

        <div className="navigation">

          {/* CHAT */}

          <button
            className={
              page === "chat"
                ? "selected"
                : ""
            }
            onClick={() =>
              navigateTo("chat")
            }
          >
            <span className="nav-icon">
              💬
            </span>

            <span>
              Chat
            </span>
          </button>

          {/* HISTORY */}

          <button
            className={
              page === "history"
                ? "selected"
                : ""
            }
            onClick={() =>
              navigateTo("history")
            }
          >
            <span className="nav-icon">
              🕘
            </span>

            <span>
              History
            </span>
          </button>

          {/* IMAGES */}

          <button
            className={
              page === "images"
                ? "selected"
                : ""
            }
            onClick={() =>
              navigateTo("images")
            }
          >
            <span className="nav-icon">
              🖼️
            </span>

            <span>
              Images
            </span>
          </button>

          {/* SUBSCRIPTION */}

          <button
            className={
              page === "subscription"
                ? "selected"
                : ""
            }
            onClick={() =>
              navigateTo(
                "subscription"
              )
            }
          >
            <span className="nav-icon">
              💳
            </span>

            <span>
              Subscription
            </span>
          </button>

          {/* SETTINGS */}

          <button
            className={
              page === "settings"
                ? "selected"
                : ""
            }
            onClick={() =>
              navigateTo("settings")
            }
          >
            <span className="nav-icon">
              ⚙️
            </span>

            <span>
              Settings
            </span>
          </button>

        </div>

        {/* SIDEBAR BOTTOM */}

        <div className="sidebar-bottom">

          <div className="profile">

            <div className="avatar">
              U
            </div>

            <div>
              <strong>
                User
              </strong>

              <small>
                Free Plan
              </small>
            </div>

          </div>

          <button
            className="logout"
            onClick={logout}
          >
            🚪 Logout
          </button>

        </div>

      </aside>

      {/* =====================================
          MAIN
      ===================================== */}

      <div className="main">

        {/* TOPBAR */}

        <header className="topbar">

          <button
            className="hamburger"
            onClick={() =>
              setSidebarOpen(
                !sidebarOpen
              )
            }
          >
            ☰
          </button>

          <div className="top-title">

            <strong>
              Nova AI
            </strong>

            <small>
              Intelligent Assistant
            </small>

          </div>

          <button
            className="top-logout"
            onClick={logout}
          >
            Logout
          </button>

        </header>

        {/* BACKEND ERROR */}

        {backendError && (
          <div className="backend-error">
            ❌ {backendError}
          </div>
        )}

        {/* =====================================
            CONTENT
        ===================================== */}

        <main className="content">

          {/* ===================================
              CHAT
          =================================== */}

          {page === "chat" && (
            <div className="chat">

              <div className="chat-title">

                <div className="ai-icon">
                  ✨
                </div>

                <div>

                  <h2>
                    How can I help you?
                  </h2>

                  <p>
                    Ask Nova AI anything
                  </p>

                </div>

              </div>

              {/* WELCOME */}

              {messages.length === 0 ? (

                <div className="welcome">

                  <div className="big-icon">
                    ✨
                  </div>

                  <h1>
                    Welcome to Nova AI
                  </h1>

                  <p>
                    Your intelligent AI
                    assistant is ready
                    to help you.
                  </p>

                  <div className="suggestions">

                    <button
                      onClick={() =>
                        setMessage(
                          "Explain JavaScript"
                        )
                      }
                    >
                      💡 Explain JavaScript
                    </button>

                    <button
                      onClick={() =>
                        setMessage(
                          "Create a React website"
                        )
                      }
                    >
                      ⚛️ Create React Website
                    </button>

                    <button
                      onClick={() =>
                        setMessage(
                          "Give me project ideas"
                        )
                      }
                    >
                      🚀 Project Ideas
                    </button>

                  </div>

                </div>

              ) : (

                <div className="messages">

                  {messages.map(
                    (item) => (

                      <div
                        className="message-group"
                        key={item.id}
                      >

                        {/* USER */}

                        <div className="user-message">

                          <div className="message-avatar">
                            U
                          </div>

                          <div className="message-content">

                            {item.user && (
                              <div className="message-text">
                                {item.user}
                              </div>
                            )}

                            {item.imagePreview && (
                              <div className="uploaded-image-box">

                                <img
                                  src={
                                    item.imageUrl ||
                                    item.imagePreview
                                  }
                                  alt="Uploaded"
                                />

                                {item.imageName && (
                                  <small>
                                    🖼️{" "}
                                    {item.imageName}
                                  </small>
                                )}

                              </div>
                            )}

                            {item.fileName && (
                              <div className="file-preview">
                                📎{" "}
                                {item.fileName}
                              </div>
                            )}

                          </div>

                        </div>

                        {/* AI */}

                        <div className="ai-message">

                          <div className="message-avatar nova">
                            N
                          </div>

                          <div className="message-content">

                            <div className="message-text">
                              {item.ai}
                            </div>

                            {item.imageUrl && (
                              <div className="backend-image">

                                <p>
                                  Uploaded Image:
                                </p>

                                <img
                                  src={
                                    item.imageUrl
                                  }
                                  alt="Backend"
                                />

                              </div>
                            )}

                            {item.uploadedFileUrl && (
                              <a
                                href={
                                  item.uploadedFileUrl
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="file-link"
                              >
                                📎 Open uploaded file
                              </a>
                            )}

                          </div>

                        </div>

                      </div>

                    )
                  )}

                </div>

              )}

              {/* INPUT */}

              <div className="input-area">

                {/* ATTACHMENT PREVIEW */}

                {(selectedImage ||
                  selectedFile) && (

                  <div className="attachment-preview">

                    {selectedImage && (
                      <div className="preview-card">

                        <img
                          src={preview}
                          alt="Preview"
                        />

                        <div>

                          <strong>
                            {selectedImage.name}
                          </strong>

                          <small>
                            Image ready
                          </small>

                        </div>

                        <button
                          onClick={
                            removeAttachment
                          }
                        >
                          ×
                        </button>

                      </div>
                    )}

                    {selectedFile && (
                      <div className="file-selected">

                        <span>
                          📎
                        </span>

                        <div>

                          <strong>
                            {selectedFile.name}
                          </strong>

                          <small>
                            File ready
                          </small>

                        </div>

                        <button
                          onClick={
                            removeAttachment
                          }
                        >
                          ×
                        </button>

                      </div>
                    )}

                  </div>
                )}

                {/* INPUT BOX */}

                <div className="input-box">

                  {/* IMAGE BUTTON */}

                  <button
                    className="attach-button"
                    type="button"
                    title="Upload Image"
                    onClick={() =>
                      imageInputRef.current?.click()
                    }
                  >
                    🖼️
                  </button>

                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={
                      handleImageSelect
                    }
                  />

                  {/* FILE BUTTON */}

                  <button
                    className="attach-button"
                    type="button"
                    title="Upload File"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                  >
                    📎
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    hidden
                    onChange={
                      handleFileSelect
                    }
                  />

                  {/* TEXT */}

                  <textarea
                    value={message}
                    placeholder="Message Nova AI..."
                    onChange={(e) =>
                      setMessage(
                        e.target.value
                      )
                    }
                    onKeyDown={
                      handleKeyDown
                    }
                    rows="1"
                  />

                  {/* SEND */}

                  <button
                    className="send-button"
                    onClick={sendMessage}
                    disabled={sending}
                  >
                    {sending
                      ? "..."
                      : "➤"}
                  </button>

                </div>

                <small className="input-note">
                  🖼️ Image &nbsp; 📎 File
                  &nbsp; • &nbsp; Enter to send
                </small>

              </div>

            </div>
          )}

          {/* ===================================
              HISTORY
          =================================== */}

          {page === "history" && (
            <div className="page">

              <div className="page-icon">
                🕘
              </div>

              <h1>
                Chat History
              </h1>

              <p>
                Your previous conversations.
              </p>

              {messages.length === 0 ? (

                <div className="empty">
                  No chat history yet.
                </div>

              ) : (

                <div className="history-list">

                  {messages.map(
                    (item) => (

                      <div
                        className="history-card"
                        key={item.id}
                      >

                        <strong>
                          {item.user ||
                            "Image/File message"}
                        </strong>

                        <p>
                          {item.ai}
                        </p>

                      </div>

                    )
                  )}

                </div>

              )}

            </div>
          )}

          {/* ===================================
              IMAGES
          =================================== */}

          {page === "images" && (
            <Images />
          )}

          {/* ===================================
              SUBSCRIPTION
          =================================== */}

          {page === "subscription" && (
            <Subscription />
          )}

          {/* ===================================
              SETTINGS
          =================================== */}

          {page === "settings" && (
            <div className="page">

              <div className="page-icon">
                ⚙️
              </div>

              <h1>
                Settings
              </h1>

              <p>
                Manage your Nova.AI preferences.
              </p>

              <div className="setting">

                <div>

                  <strong>
                    Dark Mode
                  </strong>

                  <small>
                    Nova AI dark interface
                  </small>

                </div>

                <span>
                  ON
                </span>

              </div>

              <div className="setting">

                <div>

                  <strong>
                    AI Assistant
                  </strong>

                  <small>
                    Enable AI responses
                  </small>

                </div>

                <span>
                  ON
                </span>

              </div>

            </div>
          )}

        </main>

      </div>

    </div>
  );
}

export default App;