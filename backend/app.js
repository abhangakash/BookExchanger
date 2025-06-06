const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { spawn } = require("child_process");
const axios = require("axios");
const connectDB = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");

// Import routes
const sellerRoutes = require("./routes/sellerRoutes");
const buyerRoutes = require("./routes/buyerRoutes");
const adminRoutes = require("./routes/adminRoutes");
const bookRoutes = require("./routes/bookRoutes");
const rentalRoutes = require("./routes/rentalRoutes");
const orderRoutes = require("./routes/orderRoutes");  
const reportRoutes = require("./routes/reportRoutes"); 
const dashboardRoutes = require("./routes/dashboardRoutes");
const chatRoutes = require("./routes/chatRoutes");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());

// Enable CORS


const allowedOrigins = [
    "www.bookxchanger.shop",
    "http://localhost:5173",
    "https://bookexchanger-zwks.onrender.com"
  ];
  
  app.use(cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  }));
  


// WebSocket setup
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
      origin: allowedOrigins,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  

// Attach io instance to the app (✅ Important for emitting messages)
app.set("io", io);

app.use((req, res, next) => {
    req.io = io;
    next();
});

// WebSocket Event Handling
io.on("connection", (socket) => {
    console.log("⚡ New client connected:", socket.id);

    socket.on("join_chat", (chatId) => {
        socket.join(chatId);
        console.log(`👥 User joined chat: ${chatId}`);
    });

    socket.on("send_message", (messageData) => {
        console.log("📨 New message received:", messageData);

        // ✅ Broadcast message to everyone in the chat room (including sender)
        io.in(messageData.chatId).emit("receive_message", messageData);
    });

    socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
    });
});

// Start Flask Subprocess
const flaskProcess = spawn("python", ["./ml/app.py"]);

flaskProcess.stdout.on("data", (data) => {
    console.log(`Flask stdout: ${data}`);
});

flaskProcess.stderr.on("data", (data) => {
    console.error(`Flask stderr: ${data}`);
});

flaskProcess.on("close", (code) => {
    console.log(`Flask process exited with code ${code}`);
});

// Proxy route to Flask for ML predictions
const FLASK_URL = process.env.FLASK_URL || "http://localhost:5001";
app.post("/api/predict-price", async (req, res) => {
    try {
        const flaskResponse = await axios.post(`${FLASK_URL}/predict-price`, req.body);
        res.json(flaskResponse.data);
    } catch (error) {
        console.error("❌ Error communicating with Flask:", error.message);
        res.status(500).json({ error: "Flask service error" });
    }
});

// Use routes
app.use("/api/seller", sellerRoutes);
app.use("/api/buyer", buyerRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/rentals", rentalRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/seller/reports", reportRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/chats", chatRoutes);

// Root route
app.get("/", (req, res) => {
    res.send("API is running...");
});

// Start Node.js server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} with WebSockets enabled`);
});
