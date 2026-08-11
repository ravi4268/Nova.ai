import React, { useEffect, useRef, useState } from "react";
import "./ChatPage.css";

function ChatPage() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi 👋! I am Nova AI. How are you today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const [image, setImage] = useState(null);
  const [file, setFile] = useState(null);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const imageInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // =========================
  // AUTO SCROLL
  // =========================

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  // =========================
  // SEND MESSAGE
  // =========================

const sendMessage = async () => {
  const trimmed = input.trim();

  if ((!trimmed && !image && !file) || loading) {
    return;
  }

  const userMessage =
    trimmed || "Uploaded attachment";

  const previewImage = image
    ? URL.createObjectURL(image)
    : null;

  setMessages((prev) => [
    ...prev,
    {
      role: "user",
      content: userMessage,
      image: previewImage,
      file: file ? file.name : null,
    },
  ]);

  setInput("");
  setLoading(true);

  try {
    const formData = new FormData();

    formData.append("message", trimmed);

    if (image) {
      formData.append("image", image);
    }

    if (file) {
      formData.append("file", file);
    }

    const response = await fetch(
      "http://localhost:5000/api/chat",
      {
        method: "POST",
        body: formData,
      }
    );

    const data = await response.json();

    console.log("BACKEND RESPONSE:", data);

    if (!response.ok || data.success !== true) {
      throw new Error(
        data.error || "Backend error"
      );
    }

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content:
          data.reply ||
          "Nova AI response received.",
        image: data.image?.url || null,
        file: data.file?.name || null,
      },
    ]);

    setImage(null);
    setFile(null);

  } catch (error) {
    console.error("Chat Error:", error);

    setMessages((prev) => [
      ...prev,
      {
        role: "assistant",
        content:
          "❌ Backend connection failed. Please make sure server.js is running on port 5000.",
      },
    ]);
  }

  finally {
    setLoading(false);

    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  }
};

  // =========================
  // ENTER
  // =========================

  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      !e.shiftKey
    ) {
      e.preventDefault();
      sendMessage();
    }
  };

  // =========================
  // TOPIC
  // =========================

  const startTopic = (text) => {
    setInput(text);
    inputRef.current?.focus();
  };

  // =========================
  // IMAGE
  // =========================

  const handleImage = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    setImage(selected);
  };

  // =========================
  // FILE
  // =========================

  const handleFile = (e) => {
    const selected = e.target.files[0];

    if (!selected) return;

    setFile(selected);
  };

  // =========================
  // CLEAR
  // =========================

  const clearChat = () => {
    setMessages([
      {
        role: "assistant",
        content:
          "Hi 👋! I am Nova AI. How are you today?",
      },
    ]);

    setImage(null);
    setFile(null);
  };

  return (
    <div className="nova-page">

      <div className="nova-chat">

        {/* HEADER */}

        <div className="nova-header">

          <div className="nova-info">

            <div className="nova-logo">
              ✦
            </div>

            <div>
              <h2>Nova AI</h2>

              <p>
                <span className="online-dot"></span>
                Online
              </p>
            </div>

          </div>

          <button
            className="clear-chat"
            onClick={clearChat}
          >
            🗑 Clear
          </button>

        </div>

        {/* MESSAGES */}

        <div className="nova-messages">

          <div className="conversation">

            {messages.map(
              (message, index) => (

                <div
                  key={index}
                  className={`chat-row ${message.role}`}
                >

                  {message.role ===
                    "assistant" && (
                    <div className="chat-avatar ai-avatar">
                      ✦
                    </div>
                  )}

                  <div
                    className={`chat-message ${message.role}`}
                  >

                    <div className="message-author">
                      {message.role ===
                      "assistant"
                        ? "Nova AI"
                        : "You"}
                    </div>

                    <div className="message-content">
                      {message.content}
                    </div>

                    {/* USER IMAGE */}

                    {message.image && (
                      <img
                        src={message.image}
                        alt="Uploaded"
                        className="message-image"
                      />
                    )}

                    {/* FILE */}

                    {message.file && (
                      <div className="message-file">
                        📎 {message.file}
                      </div>
                    )}

                  </div>

                  {message.role === "user" && (
                    <div className="chat-avatar user-avatar">
                      U
                    </div>
                  )}

                </div>
              )
            )}

            {/* LOADING */}

            {loading && (
              <div className="chat-row assistant">

                <div className="chat-avatar ai-avatar">
                  ✦
                </div>

                <div className="chat-message assistant">

                  <div className="message-author">
                    Nova AI
                  </div>

                  <div className="typing">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>

                </div>

              </div>
            )}

            <div ref={messagesEndRef}></div>

          </div>

        </div>

        {/* INPUT */}

        <div className="nova-input-area">

          {/* ATTACHMENT PREVIEW */}

          {(image || file) && (
            <div className="attachment-preview">

              {image && (
                <div className="attachment">

                  <img
                    src={URL.createObjectURL(image)}
                    alt="preview"
                  />

                  <button
                    onClick={() =>
                      setImage(null)
                    }
                  >
                    ×
                  </button>

                </div>
              )}

              {file && (
                <div className="file-preview">

                  📎 {file.name}

                  <button
                    onClick={() =>
                      setFile(null)
                    }
                  >
                    ×
                  </button>

                </div>
              )}

            </div>
          )}

          <div className="nova-input">

            {/* IMAGE BUTTON */}

            <button
              className="attach-button"
              type="button"
              onClick={() =>
                imageInputRef.current?.click()
              }
              title="Upload image"
            >
              🖼️
            </button>

            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleImage}
            />

            {/* FILE BUTTON */}

            <button
              className="attach-button"
              type="button"
              onClick={() =>
                fileInputRef.current?.click()
              }
              title="Upload file"
            >
              📎
            </button>

            <input
              ref={fileInputRef}
              type="file"
              hidden
              onChange={handleFile}
            />

            {/* MESSAGE */}

            <textarea
              ref={inputRef}
              value={input}
              onChange={(e) =>
                setInput(e.target.value)
              }
              onKeyDown={handleKeyDown}
              placeholder="Message Nova AI..."
              rows="1"
              disabled={loading}
            />

            {/* SEND */}

            <button
              className="send-button"
              onClick={sendMessage}
              disabled={
                loading ||
                (!input.trim() &&
                  !image &&
                  !file)
              }
            >
              {loading ? "..." : "➤"}
            </button>

          </div>

          <p className="input-note">
            Nova AI can make mistakes. Check
            important information.
          </p>

        </div>

      </div>

    </div>
  );
}

export default ChatPage;