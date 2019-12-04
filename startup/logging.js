require("express-async-errors");
const winston = require("winston");
const {format} = winston;
require("winston-mongodb");

module.exports = function() {

    process.on("unhandledRejection", (err) => {
        winston.error(err.message, err);
        process.exit(1);
    });

    winston.add(new winston.transports.File({ filename: "logfile.log" }));
    winston.add(new winston.transports.MongoDB({ 
        db: "mongodb://localhost/vidly",
        level: "info"
    }));
    winston.add(new winston.transports.Console({
        handleExceptions: true,
        format: format.combine(
                  format.colorize(),
                  format.prettyPrint(),
                  format.timestamp(),
                  format.simple()
        )
    }));

}