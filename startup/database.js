const mongoose = require("mongoose");
const winston = require("winston");

module.exports = function() {
    
    mongoose.connect('mongodb://localhost/textly')
    .then(() => winston.info('Connected to MongoDB...'));

}