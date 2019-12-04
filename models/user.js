const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("joi");

const userMaxLength = 64,
      userMinLength = 4;

const passwordMinLength = 8,
      passwordMaxLength = 64;

const emailMaxLength = 64;

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        min: userMinLength,
        max: userMaxLength,
        required: true
    },
    email: {
        type: String,
        max: emailMaxLength,
        required: true,
        unique: true
    },
    password: {
        type: String,
        min: passwordMinLength,
        max: passwordMaxLength,
        required: true
    },
    isAdmin: Boolean
});

userSchema.methods.generateAuthToken = function() {
    const token = jwt.sign({ _id: this._id, username: this.username, isAdmin: this.isAdmin }, config.get("jwtPrivateKey"))
    return token;
}

const User = mongoose.model("Users", userSchema);

const joiSchema = {
    username: Joi.string().max(userMaxLength).min(userMinLength).required(),
    email: Joi.string().max(emailMaxLength).required().email(),
    password: Joi.string().max(passwordMaxLength).min(passwordMinLength).required(),
}

function validate(user) {
    return Joi.validate(user, joiSchema);
}

exports.userSchema = userSchema;
exports.User = User;
exports.validate = validate;