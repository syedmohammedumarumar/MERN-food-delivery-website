import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const frontend_url = 'https://food-delivery-frontend-r98e.onrender.com/'; // Update this if deploying to a production environment

// Placing user order from frontend
const placeOrder = async (req, res) => {
  try {
    // Create a new order in the database
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: Math.round(req.body.amount * 100),
      address: req.body.address,
    });
    await newOrder.save();

    // Clear the user's cart
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // Create Stripe line items
    const line_items = req.body.items.map((item) => ({
      price_data: {
        currency: "inr", // Currency set to INR
        product_data: {
          name: item.name, // Product name
        },
        unit_amount: Math.round(item.price*100), // Convert price to paise (INR's smallest unit)
      },
      quantity: item.quantity, // Quantity of the item
    }));

    // Add delivery charge as a separate line item
    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 200, 
      },
      quantity: 1,
    });

    // Create Stripe session
    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};



const verifyOrder = async (req, res) =>{
  const {orderId, success} = req.body;
  try {
      if(success=='true'){
          await orderModel.findByIdAndUpdate(orderId,{payment:true});
          res.json({success:true, message:"Paid"})
      }else{
          await orderModel.findByIdAndDelete(orderId);
          res.json({success:false, message:"Not Paid"})
      }
  } catch (error) {
      console.log(error)
      res.json({success:false, message:"Error"})
  }
}

const usersOrders=async(req,res)=>{
  try {
    const orders = await orderModel.find({userId:req.body.userId})
    res.json({success:true, data:orders})
} catch (error) {
    console.log(error)
    res.json({success:false, message:"Error"})
}
}

// listing orders for admin panel

const listOrders=async(req,res)=>{
  try {
    const orders = await orderModel.find({});
    res.json({success:true, data:orders})
   } catch (error) {
        console.log(error)
        res.json({success:false, message:"Error"})  
   } 

}

//api for updating order status
const updateStatus = async (req, res) =>{
  try {
      await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
      res.json({success:true, message:"Status Updated"})
  } catch (error) {
      console.log(error)
      res.json({success:false, message:"Error"})  
  }
}

export { placeOrder,verifyOrder,usersOrders,listOrders,updateStatus };
