const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const cors = require("cors");
app.use(cors()); // add this line

io.on("connection", (socket) => {
  console.log("socket is: ", socket);
  console.log("Socket is active to be connected");

  socket.on("message", (payload) => {
    console.log("payload is ", payload);
    io.emit("message", payload);
  });
});

io.listen(4000, () => {
  console.log("server listening on port ", 4000);
});

app.get("/", (req, res) => {
  res.send("Server is running");
});
