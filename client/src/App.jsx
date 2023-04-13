import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message });
    setMessage("");
  };

  useEffect(() => {
    socket.on("message", (payload) => {
      setChat([...chat, payload]);
    });
  });

  return (
    <div className="App">
      <div></div>
      <h1>SocketIO</h1>
      <div className="card">
        <form onSubmit={handleFormSubmit}>
          <input
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            name="chat"
            placeholder="type something"
            value={message}
          />
          <button type="submit">Send</button>
        </form>
        {chat.map((payload, index) => {
          return <p key={index}>{payload.message}</p>;
        })}
      </div>
    </div>
  );
}

export default App;
