const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");

const connectDB = require("./config/db.js");

// Routes
const authRoutes = require("./routes/auth.js");
const gigRoutes = require("./routes/gigs.js");
const bidRoutes = require("./routes/bids.js");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Enable trust proxy for Render/Railway (required for secure cookies)
app.set("trust proxy", 1);

/* -------------------- SECURITY -------------------- */
app.use(helmet());

app.use(
  cors({
    origin: [
      "https://gig-flow-rho.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* -------------------- PARSERS -------------------- */
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));

/* -------------------- HEALTH CHECK (Railway) -------------------- */
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

/* -------------------- RATE LIMITING -------------------- */
app.use(
  rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 100,
    skip: (req) => req.path === "/health",
  })
);

/* -------------------- ROUTES -------------------- */
app.use("/api/auth", authRoutes);
app.use("/api/gigs", gigRoutes);
app.use("/api/bids", bidRoutes);

app.get("/", (req, res) => {
  res.send("🚀 GigFlow API running on Railway");
});

/* -------------------- SOCKET.IO -------------------- */
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "https://gig-flow-rho.vercel.app",
    credentials: true,
  },
});

app.set("io", io);

io.on("connection", (socket) => {
  console.log("🔌 Socket connected:", socket.id);

  socket.on("join", (userId) => {
    if (!userId) return;
    socket.join(userId);
    console.log(`👤 User ${userId} joined room`);
  });

  socket.on("disconnect", (reason) => {
    console.log("❌ Socket disconnected:", socket.id, reason);
  });
});

/* -------------------- START SERVER -------------------- */
server.listen(PORT, async () => {
  await connectDB();
  console.log(`✅ Server running on port ${PORT}`);
});