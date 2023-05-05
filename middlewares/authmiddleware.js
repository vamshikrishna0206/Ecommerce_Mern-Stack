let JWT=require("jsonwebtoken");
const userModel = require("../models/userModel");

//protected routes based on token

let requireSignIn=async(req,res,next)=>{
    try {
        let decode =JWT.verify(req.headers.authorization,process.env.JWT_SECRET);
        req.user=decode;
        next()   
    } catch (error) {
        console.log(error)
    }
};
//admin access
let isAdmin=async(req,res,next)=>{
    try {
        let user=await userModel.findById(req.user._id)
        if (user.role!==1){
            return res.status(401).send({
                success:false,
                message:"UnAuthorized Access"
            })
        }else{
            next()
        }
        
    } catch (error) {
        console.log(error);
        res.status(401).send({
            success:false,
            error,
            message:"Error in admin"
        })

    }
}

module.exports = {requireSignIn,isAdmin}