const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");


router.get("/", async (req, res) => {
    const count = await userModel.countDocuments();
    res.render("admin", { count });
});

module.exports = router;