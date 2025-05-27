const express = require("express");
const bodyParser = require("body-parser");
const { connectToMongo } = require("./config/connection");
const userRoutes = require("./routes/userRoutes");
const app = express();
const PORT = 5000;
const cors = require("cors");
app.use(cors());

connectToMongo();

app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Backend is Working!");
});

app.use('/api/users', userRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
});
