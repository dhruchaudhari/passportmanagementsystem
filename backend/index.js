import mongoose from "mongoose";
import connectDB from "./src/db/db.js";
import dotenv from "dotenv"
import app from "./app.js";
dotenv.config()

connectDB().then(() => {
    app.listen(`${process.env.PORT}` || 5000 , () => {
        console.log(`Listening on port ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("Mongodb connection failed" , err)
})