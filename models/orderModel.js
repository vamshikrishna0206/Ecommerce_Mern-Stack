let mongoose=require("mongoose")
let orderSchema=new mongoose.Schema({
   products:[{
    type:mongoose.ObjectId,
    ref:"Product",
   }],
   payment:{},
   buyer:{
    type:mongoose.ObjectId,
    ref:"user"
   },
   status:{
    type:String,
    default:"Not Process",
    enum:["Not Process","Processing","Shipped","deliverd","cancel"],
   }
},{
    timestamps:true
}
)

module.exports = mongoose.model("Order",orderSchema)