const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");

router.get("/", (req, res) => {
    res.render("login", { flag: "" });
});

router.post("/", async (req, res) => {

    const { email, password } = req.body;
    const getUser = await userModel.findOne({ email });
    if (getUser) {
        const comparePassword = await bcrypt.compare(password, getUser.password);
        if (comparePassword) {
            req.session.user = getUser;
            // res.redirect("/people");
            res.render("peoples", { flag: 5, user: req.session.user })
        } else {
            res.render("login", { message: "Password not match", flag: 2 });
        }
    }
    else {
        res.render("login", { message: "Can't get user", flag: 3 });
    }

});

module.exports = router;