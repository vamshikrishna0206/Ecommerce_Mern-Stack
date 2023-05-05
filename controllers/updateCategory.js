const { default: slugify } = require("slugify")
const categoryModel = require("../models/categoryModel")

let updateCategoryController=async(req,res)=>{
    try {
        const {name} =req.body
        const {id} = req.params
        const category=await categoryModel.findByIdAndUpdate(id,{name,slug:slugify(name)},{new:true})
        res.status(200).send({
            success:true,
            message:"Category Updated successfully",
            category,
        })

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error in Updation of Category"
        })
        
    }

}
module.exports={updateCategoryController}