const socket = io();

const total_signup = document.querySelector(".total_signup");
const user_live = document.querySelector(".user_live");



socket.on("user_signuped", (data) => {
    total_signup.innerHTML = `Total Signup :  ${data}`;
});


socket.on("users_live", (data) => {
    user_live.innerHTML = `Live Users : ${data}`;
});