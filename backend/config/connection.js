const mongoose = require("mongoose");

const mongoURL = "mongodb+srv://kharadevk013:Viking069@cluster0.oq8gk.mongodb.net/url?retryWrites=true&w=majority&appName=Cluster0";

async function connectToMongo(req, res) {

    try {

        await mongoose.connect(mongoURL)
        console.error("MongoDB connected successfully ");

    } catch (error) {

        console.error("Error connecting to MongoDB:", error);

    }

}

module.exports = { connectToMongo };