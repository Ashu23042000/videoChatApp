const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");

router.get("/", async (req, res) => {
    const users = await userModel.find({});
    res.render("home");
});

module.exports = router;