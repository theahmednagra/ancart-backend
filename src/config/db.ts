import mongoose from "mongoose"

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.DB_URI as string);
        console.log("Connected to database")
    } catch (error) {
        console.log("Database connection failed", error);
        process.exit(1);
    }
}

export default connectDB;