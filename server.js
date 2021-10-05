require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const path = require("path");
const http = require("http").createServer(app);
const db = require("./db");
db();
const session = require("express-session");
const mongoDbStore = require("connect-mongo");
const flash = require("express-flash");
const Emitter = require("events");


// session config------
app.use(session({
    secret: process.env.SESSION_SECRET_KEY,
    resave: false,
    store: mongoDbStore.create({ mongoUrl: process.env.DB_URL, collectionName: "sessions" }),
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 }
}));

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

app.use(flash());

// event emitter config----

const eventEmitter = new Emitter();
app.set("eventEmitter", eventEmitter);


// view engine----
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// routes----
const home = require("./routes/home");
app.use("/", home);

const signup = require("./routes/signup");
app.use("/signup", signup);

const login = require("./routes/login");
app.use("/login", login);

const logout = require("./routes/logout");
app.use("/logout", logout);

const peoples = require("./routes/peoples");
app.use("/people", peoples);

const call = require("./routes/call");
app.use("/call", call);

const admin = require("./routes/admin");
const userModel = require("./models/userModel");
app.use("/admin", admin);

http.listen(port, () => {
    console.log(`Application is listening on port ${port}`);
});



// socket.io-----
const io = require("socket.io")(http);
const users_online = [];

// let to;
// let from;

// eventEmitter.on("getData", (data) => {
//     to = data.to;
//     from = data.from;
// });


let live_user = 0;

let usersConnected = {};

// socket.io part-------------------------

io.on("connection", (socket) => {
    // console.log(socket.id);
    socket.on("newUser", (id) => {
        socket.broadcast.emit("userJoined", id);
    });

    // for streaming video-----------
    socket.on("join_room", (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit("user_connected", userId);

        // socket.on("disconnect", () => {
        //     socket.to(roomId).emit("user-disconnected", userId);
        // });
    });

    // sending live user to admin---
    live_user = live_user + 1;
    io.emit("users_live", live_user);

    // remove online users when it disconnect---
    socket.on("disconnect", () => {
        live_user = live_user - 1;
        io.emit("users_live", live_user);

        delete usersConnected[socket.id];
        io.emit("connectedUsers", usersConnected);

    });


    // broadcasting all users details to user--
    socket.on("userConnected", (data) => {
        // console.log(data);
        data.socketId = socket.id;
        if (!usersConnected[data.user_id]) {
            usersConnected[socket.id] = data;
            io.emit("connectedUsers", usersConnected);
        }
    });


    // getting the call request from user and sending it to other user------
    socket.on("callRequest", (data) => {
        io.to(data.toUserId).emit("callFromOther", { from: data.from, fromUserName: data.fromUserName });
    });

    // sending request reply to user----
    socket.on("answer", (data) => {
        io.to(data.from).emit("requestReply", data);
    })


    // emitting signuped user to admin------
    eventEmitter.on("user_signup", (data) => {
        io.emit("user_signuped", data)
    });
});







