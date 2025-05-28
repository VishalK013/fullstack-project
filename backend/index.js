const express = require("express");
const dotenv = require("dotenv").config()
const bodyParser = require("body-parser");
const { connectToMongo } = require("./config/connection");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes")
const productRoutes = require("./routes/productRoutes");
const path = require("path")
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require("cors");

app.use(cors());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

connectToMongo();

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Backend is Working!");
});

//Route
app.use('/api/users', authRoutes);//auth route
app.use('/api/users/', userRoutes)
app.use("/api/products", productRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
