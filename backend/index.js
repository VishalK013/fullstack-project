const express = require("express");
const dotenv = require("dotenv").config();
const path = require("path");
const cors = require("cors");

const { connectToMongo } = require("./config/connection");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoute");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json()); // ✅ Make sure this comes before all routes
app.use(express.urlencoded({ extended: true })); // optional, for form data
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectToMongo();

app.get("/", (req, res) => {
  res.send("Backend is Working!");
});


app.use('/api/users', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});