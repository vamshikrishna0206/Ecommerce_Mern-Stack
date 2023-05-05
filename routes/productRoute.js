let express=require("express");
const { requireSignIn, isAdmin } = require("../middlewares/authmiddleware");
const { createProductController, getProductController, getSingleProductController, productPhotoController,
     deleteProductController, updateProductController, brainTreeTokenController, brainTreePaymentsController } = require("../controllers/ProductController");
const formidable=require("express-formidable")

const router=express.Router()

//routes

//create product
router.post('/create-product',requireSignIn,isAdmin,formidable(),createProductController)

//get products
router.get('/get-product',getProductController)

//single product
router.get('/get-product/:slug',getSingleProductController)

//get photo
router.get('/product-photo/:pid',productPhotoController)

//delete product
router.delete('/delete-product/:pid',deleteProductController)

//update product
router.put('/update-product/:pid',requireSignIn,isAdmin,formidable(),updateProductController)

//payments routes
//token
router.get('/product/braintree/token',brainTreeTokenController)

//payments
router.post('/product/braintree/payment',requireSignIn,brainTreePaymentsController)

module.exports=router;
