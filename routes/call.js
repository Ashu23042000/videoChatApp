const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");


router.get("/:room", async (req, res) => {
    // const { to, from } = req.params;
    // emitting to server----
    // const event_emitter = req.app.get("eventEmitter");
    // event_emitter.emit("getData", { to, from });
    res.render("call", { room: req.params.room });
});

// router.get("/:to/:from", async (req, res) => {
//     const { to, from } = req.params;
//     // emitting to server----
//     const event_emitter = req.app.get("eventEmitter");
//     event_emitter.emit("getData", { to, from });
//     res.render("call");
// });

module.exports = router;