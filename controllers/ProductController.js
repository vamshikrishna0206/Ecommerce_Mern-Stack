const { default: slugify } = require("slugify")
const productModel = require("../models/productModel")
const fs=require("fs")
const braintree =require("braintree")
const dotenv =require("dotenv")
const orderModel = require("../models/orderModel")

dotenv.config();

//payment gateway

var gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId:process.env.BRAINTREE_MERCHANT_ID,
    publicKey:process.env.BRAINTREE_PUBLIC_KEY,
    privateKey:process.env.BRAINTREE_PRIVATE_KEY
  });


const createProductController=async(req,res)=>{
    try {
        const {name,slug,description,price,category,quantity,shipping} = req.fields
        const {photo} = req.files
        
        //validation
        switch(true){
            case !name:
                return res.status(500).send({error:'Name is Required'})
            case !description:
                return res.status(500).send({error:'Description is Required'})    
            case !price:
                return res.status(500).send({error:'Price is Required'})
            case !category:
                return res.status(500).send({error:'Category is Required'})
            case !quantity:
                return res.status(500).send({error:'Quantity is Required'})
            case photo && photo.size > 3000000:
                return res.status(500).send({error:'Photo is Required and should be less than 3 Mb'})
        }
        const products=new productModel({...req.fields,slug:slugify(name)})
        if(photo){
            products.photo.data=fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(201).send({
            success:true,
            message:"Product created successfully",
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error in creating product"
        })
        
    }

}


//get all products

const getProductController = async(req,res)=>{
    try {
        const products = await productModel.find({}).populate('category').select("-photo").limit(12).sort({createdAt:-1})
        res.status(200).send({
            success:true,
            countTotal:products.length,
            message:"All products",
            products,
        
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in getting all products",
            error:error.message
        })
        
    }
}

//get Single Product

const getSingleProductController= async(req,res)=>{
    try {
        const product = await productModel.findOne({slug:req.params.slug}).select("-photo").populate("category")
        res.status(200).send({
            success:true,
            message:" Single product Fetched",
            product,
        
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in getting single product",
            error:error.message
        })
        
    }
}

//get photo 

const productPhotoController= async(req,res)=>{
    try {
        const product = await productModel.findById(req.params.pid).select("photo")
        if(product.photo.data){
            res.set('Content-type',product.photo.contentType)
        res.status(200).send(product.photo.data)
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in getting photo of product",
            error,
        })
        
    }
}

const deleteProductController=async(req,res)=>{
    try {
        await productModel.findByIdAndDelete(req.params.id).select("-photo")
        res.status(200).send({
            success:true,
            message:"Deleted Product Successfully ",
            
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error in deleting product"
        })
        
    }
}

//update product

const updateProductController=async(req,res)=>{
    try {
        const {name,slug,description,price,category,quantity,shipping} = req.fields
        const {photo} = req.files
        
        //validation
        switch(true){
            case !name:
                return res.status(500).send({error:'Name is Required'})
            case !description:
                return res.status(500).send({error:'Description is Required'})    
            case !price:
                return res.status(500).send({error:'Price is Required'})
            case !category:
                return res.status(500).send({error:'Category is Required'})
            case !quantity:
                return res.status(500).send({error:'Quantity is Required'})
            case photo && photo.size > 3000000:
                return res.status(500).send({error:'Photo is Required and should be less than 3 Mb'})
        }
        const products=await productModel.findByIdAndUpdate(req.params.pid,{...req.fields,slug:slugify(name)},{new:true})
        if(photo){
            products.photo.data=fs.readFileSync(photo.path)
            products.photo.contentType = photo.type
        }
        await products.save()
        res.status(201).send({
            success:true,
            message:"Product updated successfully",
            products,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:"Error in updating product"
        })
        
    }

}

//payment gateway api
//token
const brainTreeTokenController=async(req,res)=>{
    try {
        gateway.clientToken.generate({},function(err,response){
            if(err){
                res.status(500).send(err)
            }else{
                res.send(response)
            }
        })
    } catch (error) {
        console.log(error)
    }
}

//payments
const brainTreePaymentsController=async(req,res)=>{
    try {
        const{cart,nonce}=req.body
        let total=0
        cart.map((i)=>{
            total+=i.price
        })
        let newTransaction=gateway.transaction.sale({
            amount:total,
            paymentMethodNonce:nonce,
            options:{
                submitForSettlement:true
            }
            
        },
        function(error,result){
            if(result){
                const order = new orderModel({
                    products:cart,
                    payment:result,
                    buyer:req.user._id,
                }).save()
                res.json({ok:true})
            }else{
                res.status(500).send(error)
            }
        }
        )
        
    } catch (error) {
        console.log(error)

    }

}

module.exports={createProductController,getProductController,getSingleProductController,
    productPhotoController,deleteProductController,updateProductController,
    brainTreeTokenController,brainTreePaymentsController}