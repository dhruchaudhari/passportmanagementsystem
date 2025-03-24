import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import errorHandler from "./src/middleware/errorHandler.js"
import centerRoutes from "./src/routes/centerRoute.js"

const app =new express()
app.use(
    cors({
        origin: "http://localhost:3000", // Replace with your frontend URL
        credentials: true, // Allow cookies to be sent
    })
);
app.use(cookieParser())
app.use(express.json())
app.use(express.static("public"))
app.use(express.urlencoded({extended : true}))



//import routes

import userRoute from "./src/routes/userRoute.js"
import passportRoutes from "./src/routes/passportRoute.js";
import documentRoutes from "./src/routes/documentsRoute.js";
import adminRoutes from './src/routes/adminRoute.js';
import walletRoutes from './src/routes/walletRoute.js'

//define routes
app.use("/users" , userRoute)
app.use("/passport", passportRoutes);
app.use("/documents", documentRoutes);
app.use("/centers", centerRoutes);
app.use('/api/admin', adminRoutes);
app.use("/wallet", walletRoutes);

app.use(errorHandler)

export default app