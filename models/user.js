const mongoose = require("mongoose")

const userScheema = new mongoose.Schema({
    userName:{
        type:String,
        required:true,
        unique:true,
        min:3,
        max:20
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        min:6,
        required:true
    },
    profilePic:{
        type:String,
        default:""
    },
    coverPic:{
        type:String,
        default:""
    },
    followers:{
        type:Array,
        default:[]
    },
    followings:{
        type:Array,
        default:[]
    },
    isAdmin:{
        type:Boolean,
        default:false
    }
},
{timestamps:true}
)

module.exports = mongoose.model("User",userScheema)