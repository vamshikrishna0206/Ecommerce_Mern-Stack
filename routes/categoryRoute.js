let express = require("express");
const { createCategoryController, categoryController, singleCategoryController, deleteCategoryController } = require("../controllers/CategoryController");
let {requireSignIn,isAdmin}=require("../middlewares/authmiddleware");
const { updateCategoryController } = require("../controllers/updateCategory");


let router=express.Router()

//routes

//create category
router.post("/create-category",requireSignIn,isAdmin,createCategoryController)

//update category
router.put("/update-category/:id",requireSignIn,isAdmin,updateCategoryController)

//getAll categories
router.get("/get-category",categoryController)

//single category
router.get("/single-category/:slug",singleCategoryController)

//delete category
router.delete("/delete-category/:id",requireSignIn,isAdmin,deleteCategoryController)




module.exports=router;