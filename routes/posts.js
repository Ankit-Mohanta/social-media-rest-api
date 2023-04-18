const router = require("express").Router()
const Post = require("../models/post")
const User = require("../models/user")

// create a post
router.post("/create", async (req,res)=>{
 const post = new Post(req.body)
 try {
    await post.save()
    return res.status(200).json(post)
 } catch (error) {
    return re.status(500).json(error)
 }
})

// update s post
router.put("/update/:id", async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id)
        if(post.userId === req.body.userId){
            await post.updateOne({$set:req.body})
            return res.status(200).json("The post has been updated")
        }else{
            return res.status(403).json("You can update only your code")
        }
    } catch (error) {
        return res.status(500).json(error)
    }
})

// delete a post
router.delete("/delete/:id", async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id)
        if(post.userId === req.body.userId){
            await post.deleteOne({$set:req.body})
            return res.status(200).json("The post has been deleted")
        }else{
            return res.status(403).json("You can delete only your code")
        }
    } catch (error) {
        return res.status(500).json(error)
    }
})

// like a post
router.put("/like/:id", async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id)
        if(!post.likes.includes(req.body.userId)){
            post.likes.push(req.body.userId)
            await post.save()
            return res.status(200).json("Liked the post")
        }else{
            post.likes.pull(req.body.userId)
            await post.save()
            return res.status(200).json("Disliked the post")
        }
    } catch (error) {
        return res.status(500).json(error)
    }
})

// get a post
router.get("/:id", async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id)
        return res.status(200).json(post)
    } catch (error) {
        return res.status(500).json(error)
    }
})

// get timelibne post
router.get("/timeline/all", async (req,res)=>{
    let postArray = []
    try {
        const currentUser = await User.findById(req.body.userId)
        const userPosts = await Post.find({userId:currentUser._id})
        const friendPosts = await Promise.all(
            currentUser.followings.map((friendId)=>{
                return Post.find({userId:friendId})
            })
        )
        return res.status(200).json(userPosts.concat(...friendPosts))
    } catch (error) {
        return res.status(500).json(error)
    }
})


module.exports = router