const _ = require("lodash");
const auth = require("../middleware/auth");
const bcrypt = require("bcrypt");
const express = require("express");
const { User, validate } = require("../models/user");
const router = express.Router();

router.get("/me", auth, async (req, res) => {

    const user = await User.findById(req.user._id).select("-password -__v");
    res.send(user);

});

router.get("/:id", async (req, res) => {

    const user = await User.findById(req.params.id).select("-password -__v");
    
    if (!user) {
        return res.status(400).send("User with that id does not exist!");
    }

    res.send(user);

})

router.post("/", async (req, res) => {

    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let errorMessage = "";

    let user = await User.findOne({ email: req.body.email });
    if (user) {
        errorMessage = "User with that email already registered! ";
    }

    user = await User.findOne({ username: req.body.username });
    if (user) { 
        errorMessage += "User with that username already registered!";
    }

    if (errorMessage.length > 0) {
        // email / username taken
        return res.status(400).send(errorMessage);
    }


    user = await User.create(new User(_.pick(req.body, ["username", "email", "password"])));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save();

    const token = user.generateAuthToken();

    res.header("x-auth-token", token).send(_.pick(user, ["username", "email"]));

});

module.exports = router;
