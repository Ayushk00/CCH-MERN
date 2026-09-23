import mongoose from "mongoose";
import {ApiError} from "../utils/ApiError.js"

const MONGODB_NAME = "CCH";

mongoose.set("strictQuery", true);

const connectdb = async () =>{
    try {
        await mongoose.connect(process.env.MONGODB_URI, { dbName: MONGODB_NAME });
        console.log("Connection to database succesfull");
    } catch (error) {
        throw new ApiError(500, `Error while connecting to database: ${error.message}`);
    }
}

export {connectdb};