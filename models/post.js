const mongoose = require("mongoose");
const Joi = require("joi");

const postSchema = new mongoose.Schema({
    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    title: {
        type: String,
        minlength: 1,
        maxlength: 256,
        required: true
    },
    body: {
        type: String,
        minlength: 1,
        maxlength: 16384,
        required: true
    },
    tags: {
        type: [String],
        required: true,
        validate: [
            (val) => { return val.length <= 16 },
            "Tags array length must not exceed 16!"
        ]        
    }
});
const Post = mongoose.model("Post", postSchema);

function validate(post) {

    const joiSchema = {
        title: Joi.string().min(4).max(256).required(),
        body: Joi.string().min(1).max(16384).required()
    }

    return Joi.validate(post, joiSchema);

}

// used to validate requests to post
const postRequestJoiSchema = {
    title: Joi.string().min(1).max(256).required(),
    body: Joi.string().min(1).max(16384).required(),
    tags: Joi.array().required()
}

function validatePostRequest(body) {
    return Joi.validate(body, postRequestJoiSchema);
}

module.exports.validatePostRequest = validatePostRequest;
module.exports.postSchema = postSchema;
module.exports.Post = Post;
module.exports.validate = validate;