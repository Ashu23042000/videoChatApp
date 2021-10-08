const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const logined_users = [];


router.get("/", async (req, res) => {
    const users = await userModel.find({});
    // const event_emitte = req.app.get("eventEmitter");
    if (req.session.user) {
        res.render("peoples", { users, user: req.session.user, flag: "" });
    } else {
        res.redirect("/login");
    }
});

module.exports = router;