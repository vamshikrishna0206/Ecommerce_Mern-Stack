let bcrypt=require("bcrypt")

let hashPassword= async(password)=>{
    try{
        let saltRounds=10;
        let hashPass = await bcrypt.hash(password,saltRounds);
        return hashPass
    }catch(error){
        console.log(error)
    }
};

let comparePassword= async(password,hashPass)=>{
    return bcrypt.compare(password,hashPass)
}

module.exports={hashPassword,comparePassword}
