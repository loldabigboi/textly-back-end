const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("joi");

function auth(req, res, next) {
    
    const token = req.header("x-auth-token");
    if (!token) {
        return res.status(401).send("Access denied: no authentication token provided");
    }
    try {
        const payload = jwt.verify(token, config.get("jwtPrivateKey"));
        req.user = payload;
        next();
    } catch(ex) {
        return res.status(400).send("Invalid authentication token.");
    }

}

module.exports = auth;