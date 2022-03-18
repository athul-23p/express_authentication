const Post = require('../models/post.model');
const express = require('express');
const router = express.Router();
const authenticate = require('../middlewares/authenticate');
const { findByIdAndUpdate } = require('../models/post.model');

router.get("/",authenticate, async (req, res) => {
  try {
      console.log(req.userId);
      let posts = await Post.find().lean().exec();
      return res.status(200).send({data: posts});
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.post('/',authenticate,async(req,res) => {
    try {
        // console.log(req.body);
        let post = await Post.create({
            ... req.body,
            user : req.userId
        });

        return res.status(201).send(post);
    } catch (error) {
        return res.status(500).send(error);
    }
})

router.patch("/:id",authenticate, async (req, res) => {
  try {
    // console.log(req.userId);
    let post  = await Post.findById(req.params.id).lean().exec(); 
    // console.log(post.user.toString());
    if(post){
        if(post.user.toString() !== req.userId){
            return res.status(400).send({err: 'This is not your post'})
        }

        post  = await Post.findByIdAndUpdate(req.params.id,req.body,{new:true});
    }

  
    return res.status(201).send(post);
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.delete("/:id",authenticate, async (req, res) => {
  try {
       let post  = await Post.findById(req.params.id).lean().exec(); 
    // console.log(post.user.toString());
    if(post){
        if(post.user.toString() !== req.userId){
            return res.status(400).send({err: 'This is not your post'})
        }
        post = await Post.findByIdAndDelete(req.params.id).lean().exec();
    }

    return res.status(201).send({msg:'deleted post',post});
    
  } catch (error) {
    return res.status(500).send(error);
  }
});

module.exports = router;