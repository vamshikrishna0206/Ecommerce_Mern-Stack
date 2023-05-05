const { default: slugify } = require("slugify")
const categoryModel = require("../models/categoryModel")

//create category
let createCategoryController=async(req,res)=>{
    try {
        let {name}=req.body
        if(!name){
            return res.status(401).send({messsage:'Name is required'})
        }
        const existingCategory=await categoryModel.findOne({name})
        if(existingCategory){
            return res.status(200).send({
                success:true,
                messsage:"Category Already Exists"
            });
        }
            const category = await new categoryModel({name,slug:slugify(name)}).save()
            res.status(201).send({
                success:true,
                messsage:"New Category Created",
                category

            })
        

    } catch (error){
    res.status(500).send({
        success:false,
        error,
        messsage:"Error in Category"
    })
    }
}


//getAll categories
const categoryController = async(req,res)=>{
    try {
        const category= await categoryModel.find({})
        res.status(200).send({
            success:true,
            message:"All Categories List",
            category
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error while getting all categories"
        })
        
    }

}

//single category
const singleCategoryController=async(req,res)=>{
    try {
        const{slug}=req.params
        const category= await categoryModel.findOne({slug:req.params.slug})
        res.status(200).send({
            success:true,
            message:"Getting Single Category Successfull ",
            category
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error while getting single category"
        })
        
    }
}

//delete category
const deleteCategoryController=async(req,res)=>{
    try {
        const{id}=req.params
        const category= await categoryModel.findByIdAndDelete(id)
        res.status(200).send({
            success:true,
            message:"Deleted Category Successfully ",
            category
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error in deleting category"
        })
        
    }
}




module.exports={createCategoryController,categoryController,singleCategoryController,deleteCategoryController}