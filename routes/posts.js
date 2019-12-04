const { Post, validatePostRequest, validate } = require("../models/post");
const { User } = require("../models/user");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

router.get("/", async (req, res) => {

    const numPosts = (req.query.count) ? +req.query.count : 25;

    const posts = await Post.find().select("-__v").sort("-_id").limit(numPosts);

    for (let i = 0; i < posts.length; i++) {
        posts[i] = posts[i].toObject();
        posts[i].uploadDate = (new mongoose.Types.ObjectId(posts[i]._id)).getTimestamp();
    }

    console.log(posts);
    res.send(posts);

});

router.get("/:id", async (req, res) => {

    let post = await Post.findById(req.params.id).select("-__v");

    if (!post) {
        return res.status(400).send("Post with that id does not exist.");
    }   

    post = post.toObject();
    post.uploadDate = (new mongoose.Types.ObjectId(req.params.id)).getTimestamp();
    res.send(post);

});

router.post("/", [auth], async (req, res) => {

    const { error } = validatePostRequest(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(400).send("Invalid JWT: User with that id does not exist!");
    }

    let post = await Post.create(new Post({
        authorId: user._id,
        title: req.body.title,
        body: req.body.body,
        tags: req.body.tags
    }));
    post = post.toObject();
    delete post.__v;  // user doesn't need to see version

    res.send(post);
    
});

router.put("/:id", [auth], async (req, res) => {

    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let post = await Post.findByIdAndUpdate(req.params.id, {
        title: req.body.title,
        body: req.body.body
    }).catch(() => {});

    if (!post) {
        return res.status(400).send("Post with that id does not exist.");
    }

    post = post.toObject();
    delete post.__v;  // user doesn't need to see version

    res.send(post);

});

router.delete("/:id", [auth, admin], async (req, res) => {

    let post = await Post.findByIdAndRemove(req.params.id);

    if (!post) {
        return res.status(400).send("Post with that id does not exist.");
    }

    post = post.toObject();
    delete post.__v;  // user doesn't need to see version

    res.send(post);
    
});

module.exports = router;