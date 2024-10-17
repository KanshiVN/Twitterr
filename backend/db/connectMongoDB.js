import mongoose from "mongoose";



const connectMongDB = async () => {

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Server Connected...');

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

export default connectMongDB;