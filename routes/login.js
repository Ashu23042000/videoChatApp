const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const userModel = require("../models/userModel");

router.get("/", (req, res) => {
    res.render("login");
});

router.post("/", async (req, res) => {

    const { email, password } = req.body;
    console.log(email, password)
    const getUser = await userModel.findOne({ email });
    if (getUser) {
        const comparePassword = await bcrypt.compare(password, getUser.password);
        if (comparePassword) {
            req.session.user = getUser;
            res.redirect("/people");
        } else {
            res.render("login", { message: "Password not match" });
        }
    }
    else {
        res.render("login", { message: "Can't get user" });
    }

});

module.exports = router;