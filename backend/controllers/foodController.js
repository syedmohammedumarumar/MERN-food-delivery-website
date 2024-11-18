import foodModel from "../models/foodModel.js";
import fs from 'fs';


// add new food item
const addFood = async (req,res) =>{
    let image_filename = `${req.file.filename}`;

    const food = new foodModel({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        category:req.body.category,
        image:image_filename
    })
    try{
        await food.save();
        res.json({success:true,message:"Food Added"});
    }catch(error){
        console.log(error);
        res.json({success:false,message:"Error"});
    }
}

// displaying all food list 

const listFood=async(req,res)=>{
    try {
        const foods= await foodModel.find({})
        res.json({success:true, data:foods})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:'error occured'})
    }
}

//removing food from db
const removeFood=async(req,res)=>{
    try {
        const food= await foodModel.findById(req.body.id)
        fs.unlink(`uploads/${food.image}`,()=>{})

        await foodModel.findOneAndDelete(req.body.id);
        res.json({success:true,message:'Food removed'})
    } catch (error) {
        console.log(error);
        res.json({success:false,message:'error occured'})
    }
}


export { addFood,listFood,removeFood };
