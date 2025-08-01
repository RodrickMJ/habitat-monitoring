import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI as string)
    .then(() => {
        console.log("");
    })
    .catch((error) => {
        console.error(error);
    });

const dbMongo = mongoose.connection;

dbMongo.on("error", console.error.bind(console, "connection error:"));

export {dbMongo, mongoose}