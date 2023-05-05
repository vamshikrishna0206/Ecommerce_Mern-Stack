let express=require("express")
let dotenv=require("dotenv")
let mongoose=require("mongoose")
let authRoutes=require("./routes/authRoute")
let cors=require("cors")
let categoryRoute=require("./routes/categoryRoute")
let productRoute=require("./routes/productRoute")
let path=require("path")

let app=express();
dotenv.config();

//middlewares:
app.use(cors());
app.use(express.json())
app.use(express.static(path.join(__dirname,'./client/build')))

//Routes:
app.use("",authRoutes)
app.use("",categoryRoute)
app.use("",productRoute)

//app.use('*',function(req,res){
    res.sendFile(path.join(__dirname,'./client/build/index.html'));
})

mongoose.connect("mongodb://127.0.0.1:27017/ecommerce",{useUnifiedTopology:true,useNewUrlParser:true}).then(()=>{
    console.log("DB Connection ok")
}).catch((error)=>{
    console.log("DB connection failed")
})


app.get("/",(req,res)=>{
 res.send("Welcome")
})
let PORT=process.env.PORT ||8080;

app.listen(PORT,()=>{
    console.log("Listening on Port-8080") 
})