const express = require("express");
const dotenv = require("dotenv").config();
const path = require("path");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const { connectToMongo } = require("./config/connection");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoute");
const orderRoute = require("./routes/orderRoute");
const wishlistRoute = require("./routes/wishlistRoute");
const adminRoute = require("./routes/adminRoute");
const reviewRoute = require("./routes/reviewRoute");

const app = express();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://192.168.1.1:5174",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
  }
});


const onlineUsers = {};

io.on("connection", (socket) => {
  const userId = socket.handshake.query?.userId;

  if (!userId) {
    console.log("Socket", socket.id, "connected without userId");
    return;
  }

  onlineUsers[userId] = socket.id;
  console.log(`User ${userId} connected with socket ${socket.id}`);

  socket.on("disconnect", () => {
    for (const id in onlineUsers) {
      if (onlineUsers[id] === socket.id) {
        delete onlineUsers[id];
        console.log(`User ${id} disconnected`);
        break;
      }
    }
  });
});



app.set("io", io);
app.set("onlineUsers", onlineUsers);


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order", orderRoute);
app.use("/api/wishlist", wishlistRoute);
app.use("/api/admin", adminRoute);
app.use("/api",reviewRoute)

app.get("/", (req, res) => {
  res.send("Backend is Working!");
});

connectToMongo();
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
