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

require("dotenv").config(); // Load environment variables from .env file
const mongoose = require("mongoose");

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");

    // Add a route to retrieve all messages
    app.get("/messages", async (req, res) => {
      const messagesCollection = mongoose.connection.collection("messages");
      const messages = await messagesCollection
        .find()
        .sort({ timestamp: 1 })
        .toArray();
      res.json(messages);
    });

    server.listen(5000, () => {
      console.log("Server listening on port ", 5000);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB: ", err);
    process.exit(1);
  });

const messagesSchema = new mongoose.Schema({
  name: String,
  message: String,
  timestamp: String,
});

const Message = mongoose.model("Message", messagesSchema);

io.on("connection", (socket) => {
  console.log("Socket is active to be connected");

  socket.on("message", async (payload) => {
    console.log("payload is ", payload);

    const message = new Message({
      name: payload.name,
      message: payload.message,
      timestamp: new Date().toISOString(),
    });

    // Save the message to MongoDB
    await message.save();

    // Emit the message to all connected clients
    io.emit("message", message);
  });
});

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});
