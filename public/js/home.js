const socket = io("");
const peer = new Peer()

const videoGrid = document.querySelector(".videoGrid");
const myVideo = document.createElement("video");
myVideo.muted = true;


function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        video.play();
    });
    videoGrid.appendChild(video);
}



navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then((stream) => {
    addVideoStream(myVideo, stream);
}).catch((err) => {
    console.log(err);
});








// peer.on("open", (id) => {
//     socket.emit("newUser", id);
// });

// socket.on("userJoined", (id) => {
//     console.log(id);
// })

const userId = document.querySelector(".userId");
const user_id = userId.value;
console.log(user_id);
socket.emit("removeUser", user_id);