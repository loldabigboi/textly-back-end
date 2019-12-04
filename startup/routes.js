const express = require("express");
const posts = require("../routes/posts");
const auth = require("../routes/auth");
const users = require("../routes/users");
const error = require("../middleware/error");
const cors = require("cors");

module.exports = function(app) {
    
    app.use(express.json());
    app.use(cors());

    app.use("/api/users", users);
    app.use("/api/posts", posts);
    app.use("/api/auth", auth);

    app.use(error);

};