const mongoose = require("mongoose");


async function connectToMongo(req, res) {

    try {

        await mongoose.connect(process.env.CONNECTION_STRING)
        console.error(`MongoDB connected successfully :  ${mongoose.connection.host}`);

    } catch (error) {

        console.error("Error connecting to MongoDB:", error);

    }

}

module.exports = { connectToMongo };