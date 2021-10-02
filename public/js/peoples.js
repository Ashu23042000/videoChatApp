const socket = io();

const users_grid = document.querySelector(".users_grid");

const user_name = document.querySelector(".username");
const user__name = user_name.value;
const profession = document.querySelector(".profession");
const user_profession = profession.value;
const level = document.querySelector(".level");
const user_level = level.value;
const userId = document.querySelector(".userId");
const user_id = userId.value;
let from;
let fromUserName;

const userData = {
    user__name, user_profession, user_level, user_id
}


// sending data to server------

socket.emit("userConnected", userData);

// getting connected users details from server----

socket.on("connectedUsers", (data) => {
    showConnectedUsers(data);
});


// calling another user----
function call(toUserId, from, fromUserName) {
    socket.emit("callRequest", { toUserId, from, fromUserName });
};



function showConnectedUsers(data) {
    users_grid.innerHTML = " ";
    for (let key of Object.keys(data)) {
        if (data[key].user_id == user_id) {
            from = key;
            fromUserName = data[key].user__name;
        }
        if (data[key].user_id != user_id) {
            const userDiv = document.createElement("div");
            userDiv.classList.add("users");
            userDiv.innerHTML = ` <h2>
                        ${data[key].user__name}
                    </h2>
                    <div>
                        <span>
                           ${data[key].user_profession}
                        </span>
                        <span>
                        ${data[key].user_level}
                        </span>
                    </div>
                    <button ${onclick = function () { call(key, from, fromUserName) }}>Start Conversation</button>`;

            users_grid.appendChild(userDiv);
        }
    }
}

// accepting or decline call request----
socket.on("callFromOther", async (data) => {
    let answer = confirm(`${data.fromUserName} calling  you`);

    if (answer) {
        let res = await fetch(`/call/${data.from}`, { method: "GET" });
        // sending call request reply to server---
        socket.emit("answer", { answer, from: data.from })
        window.location.href = res.url;
    }
    // sending call request reply to server---
    socket.emit("answer", { answer, from: data.from })

});

// showing call request reply of other user-----
socket.on("requestReply", async (data) => {
    if (data.answer) {
        let res = await fetch(`/call/${data.from}`, { method: "GET" });
        window.location.href = res.url;
    } else {
        alert(`Didn't answer you`);
    }
});


