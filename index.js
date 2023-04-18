const express = require("express");
const app = express();

const dotenv = require("dotenv")
dotenv.config();

const mongoose = require('mongoose')
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    console.log("Connection established")
}).catch((err)=>{
    console.error(err)
})

// Middlewares
app.use(express.json())
const helmet = require("helmet")
const morgan = require("morgan")
app.use(helmet())
app.use(morgan('common'))

//routes
app.get('/',(req,res)=>{
    res.send("Hello world!!")
})

const userRoute = require("./routes/user");
const userAuth = require("./routes/auth");
const posts = require("./routes/posts");
app.use("/api/users",userRoute)
app.use("/api/auth",userAuth)
app.use("/api/posts",posts)

app.listen(8000,()=>{
    console.log("Backend server is ready");
})