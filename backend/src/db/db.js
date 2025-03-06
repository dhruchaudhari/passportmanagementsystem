import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}`)
        console.log("MONGO Connection success")
    } catch (error) {
        console.log("Mongodb connection failed",error)
        throw error
    }
}
export default connectDB