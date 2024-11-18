import mongoose from "mongoose";

export const connectDb=async()=>{
    await mongoose.connect('mongodb+srv://umar:umarmd@cluster0.jo5ln.mongodb.net/food-delivery').then(()=>console.log('DB Connected'))

}