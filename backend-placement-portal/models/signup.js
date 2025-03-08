const mongoose=require('mongoose');
const SignupSchema=new mongoose.Schema({
    name:{
        type:"String"
    },
    email:{
        type:"String"
    },
    password:{
        type:"String"
    },
    type:{
        type:"String"
    }
})

module.exports=mongoose.model("signup",SignupSchema)