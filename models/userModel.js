const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    level: {
        type: String,
        required: true
    },
    profession: {
        type: String,
        required: true
    },
    reportCount: {
        type: Number,
        required: true
    }
});

const userModel = new mongoose.model("user", userSchema);

module.exports = userModel;