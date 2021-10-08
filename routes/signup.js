const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");

router.get("/", (req, res) => {
    res.render("signup", { flag: "" });
});



router.post("/", async (req, res) => {
    const { name, email, level, profession, password, confirmPassword, } = req.body;
    if (password == confirmPassword) {
        const getUser = await userModel.findOne({ email });
        if (getUser) {
            res.render("signup", { message: "Email already registered", flag: 3 });
        }
        else {
            const hashpassword = await bcrypt.hash(password, 10);
            const user = new userModel({ name, email, password: hashpassword, level, profession, reportCount: 0 });
            await user.save();
            // const count = await userModel.countDocuments();
            // const eventEmitter = req.app.get("eventEmitter");
            // eventEmitter.emit("user_signup", count)
            res.render("login", { flag: 1 });
        }
    } else {
        res.render("signup", { message: "Password not match", flag: 2 });
    }
});

module.exports = router;