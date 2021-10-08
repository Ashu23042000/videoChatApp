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
function call(data) {
    socket.emit("callRequest", { toUserId: data.key, from: data.from, fromUserName: data.fromUserName });
};



function showConnectedUsers(data) {
    users_grid.innerHTML = " ";




    Object.keys(data).forEach((key) => {

        Object.keys(data).forEach((key) => {
            if (data[key].user_id == user_id) {
                from = key;
                fromUserName = data[key].user__name;
            }
        })

        if (data[key].user_id != user_id) {
            // console.log(`Connected sockets ${key}`)
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
                
                 <button class="callBtn">
                  <span>Call</span>
                  <input value=${JSON.stringify({ key: key, from: from, fromUserName: fromUserName })} type="hidden"></input>
                  </button>
                    `;
            users_grid.appendChild(userDiv);
        }

    });








    const callBtns = document.querySelectorAll(".callBtn");
    callBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            // console.log(JSON.parse(btn.innerHTML))
            // let a = btn.lastElementChild.value
            // console.log(JSON.parse(a));
            call(JSON.parse(btn.lastElementChild.value));
        });
    })
}




// accepting or decline call request----
socket.on("callFromOther", async (data) => {
    // let answer = confirm(`${data.fromUserName} calling  you`);
    let answer = await swal(`${data.fromUserName} wants to talk with you.`, {
        buttons: ["Decline", "Accept"],
    });

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
        swal("Didn't answer you", "", "error", {
            button: "Ok",
        });
        // alert(`Didn't answer you`);
    }
});


