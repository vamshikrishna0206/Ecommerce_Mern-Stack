let userModel=require("../models/userModel")
const { hashPassword, comparePassword } = require("../helpers/authHelper")
let JWT=require("jsonwebtoken")
const orderModel = require("../models/orderModel")

let regController=async(req,res)=>{
    try{
        let {name,email,password,phone,address}=req.body

//validations

        if(!name){
            return res.send({message:"Name is Required"})
        }
        if(!email){
            return res.send({message:"Email is Required"})
        }
        if(!password){
            return res.send({message:"Password is Required"})
        }
        if(!phone){
            return res.send({message:"Phone is Required"})
        }
        if(!address){
            return res.send({message:"Address is Required"})
        }


//checking existing user

        let existUser=await userModel.findOne({email})
         if (existUser){
            return res.status(200).send({
                success:false,
                message:"Already Registered please Login"
            })
         }

//register user

         let hashPass=await hashPassword(password)
         //save
         let user= await new userModel({name,email,phone,address,password:hashPass}).save()

         return res.status(201).send({
            success:true,
            message:"User Registration success",
            user
         })
    }catch(error){
        console.log(error)
        return res.status(500).send({
            success:false,
            message:"Error in Registration"
        })
    }
}
//Login

let loginController= async(req,res)=>{
    try {
        let {email,password}=req.body
        //validation
        if(!email || !password){
            return res.status(404).send({
                success:false,
                message:"Invalid Email or Password"
            })
        }
        let user= await userModel.findOne({email})
        if(!user){
            return res.status(404).send({
                success:false,
                message:"Email is not registered",
            })
        }
        let match=await comparePassword(password,user.password)
        if(!match){
            return res.status(200).send({
                success:false,
                message:"Invalid Password",
            })
        }

//token
let token=await JWT.sign({_id:user._id},process.env.JWT_SECRET,{
            expiresIn:"7d",
        });
        res.status(200).send({
            success:true,
            message:"Login Success",
            user:{
                name:user.name,
                email:user.email,
                phone:user.phone,
                address:user.address,
                role:user.role,
            },token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success:false,
            message:"Error in Login",
            error,
        })
    }
}
//test controller
let testController=(req,res)=>{
    res.send("protected")
}

//update profile
let updateProfileController = async(req,res)=>{ 
   try {
    const {name,email,password,address,phone} = req.body
    const user=await userModel.findById(req.user._id)

    //password
    if(password && password.length<6){
        return res.json({error:'password is required and should 6 charecters'})
    }
    const hashedPassword=password ? await hashPassword(password):undefined
    const updatedUser = await userModel.findByIdAndUpdate(req.user._id,{
        name:name || user.name,
        password: hashedPassword || user.password,
        phone: phone || user.phone,
        address: address || user.address
    },{new:true})
    res.status(200).send({
        success:true,
        message:"Profile Updated Successfully",
        updatedUser,
    })
   } catch (error) {
        console.log(error)
        res.status(400).send({
            success:false,
            message:'Error while Updating profile',
        })
    }
}

//orders

const getOrdersController=async(req,res)=>{
    try {
        const orders=await orderModel.find({buyer:req.user._id}).populate("products","-photo").populate("buyer","name")
        res.json(orders)
    } catch (error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error while getting orders",
            error
        })       
    }
}

//all orders

const getAllOrdersController=async(req,res)=>{
    try {
        const orders=await orderModel.find({}).populate("products","-photo")
        .populate("buyer","name").sort({createdAt:"-1"})
        res.json(orders);
    } catch (error){
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error while getting orders",
            error
        })       
    }
}


//order status change

const orderStatusController= async(req,res)=>{
    try {
        const {orderId} = req.params
        const {status} = req.body
        const orders = await orderModel.findByIdAndUpdate(orderId,{status},{new:true})
        res.json(orders)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error while getting all orders",
            error
        })   
        
    }
}


module.exports={regController,loginController,testController,updateProfileController,
    getOrdersController,getAllOrdersController,orderStatusController}
