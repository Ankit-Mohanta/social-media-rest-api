const router = require('express').Router()
const bcrypt = require("bcrypt")
const User = require('../models/user')

// update user
router.put('/update/:id', async (req,res)=>{

    if(req.body.userId === req.params.id){

        if(req.body.password){

            try {   
                const salt = await bcrypt.genSalt(10)
                req.body.password = await bcrypt.hash(req.body.password,salt)   
            } catch (error) {
                return res.status(500).json(error)
            }
        }

        try {
            const user = await User.findByIdAndUpdate(req.params.id, {$set:req.body})
            return res.status(200).json("Account updated successfully")
        } catch (error) {
            return res.status(500).json(error)
        }
    }else{
        res.status(403).json("You can update only your account")
    }
})

// delete user
router.delete('/delete/:id', async (req,res)=>{

    if(req.body.userId === req.params.id){
        try {
            const user = await User.findByIdAndDelete(req.params.id)
            return res.status(200).json("Account deleted successfully")
        } catch (error) {
            return res.status(500).json(error)
        }
    }else{
        res.status(403).json("You can delete only your account")
    }
})

// get a user
router.get('/:id', async (req,res)=>{
    try {
        const user = await User.findById(req.params.id)
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json("User not exist")
    }
})

// follow a user
router.put('/:id/unfollow', async (req,res) =>{
    if (req.body.userId !== req.params.id){

        try {
            const user = await User.findById(req.params.id) // user to whom the current user wants to follow
            const currentUser = await User.findById(req.body.userId) // currentuser or user
            if(user.followers.includes(req.body.userId)){
                user.followers.pull(req.body.userId)
                await user.save()
                await currentUser.updateOne({$pull: {followings:req.params.id}})
                return res.status(200).json("User is now unfollowing")
            }else{
                return res.status(401).json("You already unfollow this user")
            }

        } catch (error) {
            return res.status(500).json(error)
        }

    }else{
        return res.status(403).json("You can't unfollow yourself")
    }
})

// unfollow a user
router.put('/:id/follow', async (req,res) =>{
    if (req.body.userId !== req.params.id){

        try {
            const user = await User.findById(req.params.id) // user to whom the current user wants to follow
            const currentUser = await User.findById(req.body.userId) // currentuser or user
            if(!(user.followers.includes(req.body.userId))){
                user.followers.push(req.body.userId)
                await user.save()
                await currentUser.updateOne({$push: {followings:req.params.id}})
                return res.status(200).json("User is now following")
            }else{
                return res.status(401).json("You already follow this user")
            }

        } catch (error) {
            return res.status(500).json(error)
        }

    }else{
        return res.status(403).json("You can't follow yourself")
    }
})

module.exports = router