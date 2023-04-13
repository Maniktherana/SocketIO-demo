import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import "./App.css";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

function App() {
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [chat, setChat] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // load all messages on page load
    const reqUrl = `http://localhost:5000/messages`;
    axios.get(reqUrl).then((res) => {
      setChat(res.data);
    });
  }, []);

  const handleClick = async () => {
    try {
      setLoading(true);
      const reqUrl = `http://localhost:5000/messages`;
      setLoading(true);
      const toastResponse = await toast.promise(
        axios.get(reqUrl),
        {
          loading: "sending",
          success: `send!`,
          error: "Error",
        },
        {
          style: {
            borderRadius: "30px",
            background: "rgb(26 86 219)",
            color: "#fff",
          },
        }
      );
      setLoading(false);
      setChat(toastResponse.data);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const sent = { name: name, message: message };
    socket.emit("message", sent);
    setMessage("");
    handleClick();
  };

  return (
    <div className="App">
      <Toaster />
      <div></div>
      <h1>SocketIO</h1>
      <div className="card">
        <form onSubmit={handleFormSubmit}>
          <input
            onChange={(e) => setName(e.target.value)}
            type="text"
            name="chat"
            placeholder="type your name"
            value={name}
          />
          <input
            onChange={(e) => setMessage(e.target.value)}
            type="text"
            name="chat"
            placeholder="type something"
            value={message}
          />

          <button type="submit">Send</button>
        </form>
        {!loading &&
          chat.map((payload, index) => {
            return (
              <p key={index}>
                {payload.name}: {payload.message}
              </p>
            );
          })}
      </div>
    </div>
  );
}

export default App;
