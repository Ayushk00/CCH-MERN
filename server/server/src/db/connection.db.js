import mongoose from "mongoose";
import {ApiError} from "../utils/ApiError.js"

const MONGODB_NAME = "CCH";

const connectdb = async () =>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${MONGODB_NAME}`);
        console.log("Connection to database succesfull");
    } catch (error) {
        throw new ApiError(500, "Error while connecting to database");
    }
}

export {connectdb};