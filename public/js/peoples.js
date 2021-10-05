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
    console.log(data);
    showConnectedUsers(data);
});


// calling another user----
function call(toUserId, from, fromUserName) {
    // console.log(`Call request sending to ${toUserId}`);
    // const userSocketId = document.querySelector("#userSocketId").value;
    // console.log(userSocketId);
    console.log(toUserId);
    socket.emit("callRequest", { toUserId, from, fromUserName });
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
            // ${ onclick = call }
            // const callBtn = document.querySelector(".callBtn");
            // callBtn.onclick =


            //     addEventListener('click', () => {
            //         // call(data[key].socketId, from, fromUserName);
            //         console.log(`clicked on ${data[key].socketId}`)
            //     })
        }

    });

    // < id="callBtn" ${onclick = function () {
    //     console.log(`clicked on ${data[key].socketId}`);
    //     call(data[key].socketId, from, fromUserName)
    // }} Start Conversation</ button>

    // <button id="callBtn">Call</button>


    // <input type="hidden" value=${from} class="from">
    //     <input type="hidden" value=${fromUserName} id="fromUserName">
    //         <input type="hidden" value=${key} id="userSocketId">





    // for (let key of Object.keys(data)) {
    //     if (data[key].user_id == user_id) {
    //         from = key;
    //         fromUserName = data[key].user__name;
    //     }
    //     if (data[key].user_id != user_id) {
    //         console.log(`Connected sockets ${key}`)
    //         const userDiv = document.createElement("div");
    //         userDiv.classList.add("users");
    //         userDiv.innerHTML = ` <h2>
    //                     ${data[key].user__name}
    //                 </h2>
    //                 <div>
    //                     <span>
    //                        ${data[key].user_profession}
    //                     </span>
    //                     <span>
    //                     ${data[key].user_level}
    //                     </span>
    //                 </div>
    //                 <button ${onclick = function (event) {
    //                 event.preventDefault();
    //                 console.log(`clicked on ${key}`);
    //                 call(key, from, fromUserName)
    //             }}>Start Conversation</button>`;

    //         users_grid.appendChild(userDiv);
    //     }
    // }




    const callBtns = document.querySelectorAll(".callBtn");
    callBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            // console.log(JSON.parse(btn.innerHTML))
            let a = btn.lastElementChild.value
            console.log(JSON.parse(a));

        });
        console.log(btn);

    })
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


