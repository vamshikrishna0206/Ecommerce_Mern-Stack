let express=require("express")
let {regController,loginController,testController, updateProfileController, getOrdersController,
    getAllOrdersController, orderStatusController}=require("../controllers/authController")
let {requireSignIn,isAdmin}=require("../middlewares/authmiddleware")


let router = express.Router()

//register route
router.post("/register",regController);

//login route
router.post("/login",loginController);

//test routes
router.get('/test',requireSignIn,isAdmin,testController)

//protected User routes auth
router.get("/user",requireSignIn,(req,res)=>{
    res.status(200).send({ok:true})
})

//protected Admin routes auth
router.get("/admin",requireSignIn,isAdmin,(req,res)=>{
    res.status(200).send({ok:true})
})

//update profile
router.put('/profile',requireSignIn,updateProfileController)

//orders
router.get('/orders',requireSignIn,getOrdersController)

//all orders
router.get('/all-orders',requireSignIn,getAllOrdersController)

//order status change
router.put("/order-status/:orderId",requireSignIn,isAdmin,orderStatusController)

module.exports=router;