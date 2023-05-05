let mongoose=require("mongoose")
let categorySchema=new mongoose.Schema({
    name:{
        type:String,
        //required:true,
        //trim:true
    },
    slug:{
        type:String,
        lowercase:true,
    }
}
)

module.exports = mongoose.model("Category",categorySchema)