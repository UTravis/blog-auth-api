import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

const connect = async () => {
    if(!MONGODB_URI) {
        throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
    }
    const connectionState = mongoose.connection.readyState;

    if (connectionState === 1) {
        console.log("DB Already Connected");
        return;
    }

    if(connectionState === 2) {
        console.log("DB Connectiong ...");
        return;
    }

    try {
        await mongoose.connect(MONGODB_URI, {
            dbName: "nextjs-auth-blog-db",
            bufferCommands: true,
        })
        console.log("DB Connected");
    }catch (error) {
        console.error("DB Error", error);
        throw new Error(`DB Connection Error: ${error}`);
    }
}

export default connect;