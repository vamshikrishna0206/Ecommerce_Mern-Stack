let mongoose=require("mongoose")
let productSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    slug:{
        type:String,
        lowercase:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,

    },
    category:{
        type:mongoose.ObjectId,
        ref:"Category",
        required:true
    },
    quantity:{
        type:Number,
        required:true,
    },
    photo:{
        data:Buffer,
        contentType:String,
  
    },
    shipping:{
        type:Boolean
    },
},
{timestamps:true}

)

module.exports = mongoose.model("Product",productSchema)