const _ = require("lodash");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();

const passwordMinLength = 8,
      passwordMaxLength = 32;

const emailMaxLength = 64;

router.post("/", async (req, res) => {

    let token = req.header("x-auth-token");
    if (token) {
        // jwt token provided
        if (jwt.verify(token, config.get("jwtPrivateKey"))) {  // valid token
            return res.send({ "jwt": token });
        }
    }

    const { error } = validate(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    let user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(400).send("Invalid email or password.");
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
        return res.status(400).send("Invalid email or password.");
    }

    token = user.generateAuthToken();

    res.send({ "jwt": token });

});

const joiSchema = {
    email: Joi.string().max(emailMaxLength).required().email(),
    password: Joi.string().max(passwordMaxLength).min(passwordMinLength).required(),
}

function validate(user) {
    return Joi.validate(user, joiSchema);
}

module.exports = router;
