const router = require('express').Router()
const User = require("../models/user")
const bcrypt = require("bcrypt")

router.post('/register', async (req,res)=>{
    
    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(req.body.password,salt)

        const user = new User({
            userName:req.body.username,
            email:req.body.email,
            password:hashedPassword,
        })

        const newUser = await user.save()
        res.send(newUser)
    } catch (error) {
        res.status(500).json(error)
    }
    
})

router.post('/login', async (req,res)=>{
    
    try {
        const user = await User.findOne({email:req.body.email})
        !user && res.status(404).send("User not exist")

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        !validPassword && res.status(400).send("Wrong password")

        res.status(200).json(user)
    } catch (error) {
        res.status(500).json(error)
    }

})

module.exports = router