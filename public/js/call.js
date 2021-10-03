const socket = io();

const hamburger = document.querySelector(".hamburger");
const hamburger_navMenu = document.querySelector(".hamburger_navMenu");

hamburger.addEventListener("click", () => {
    hamburger_navMenu.classList.toggle("show");
});

console.log(roomId);


const peer = new Peer()
const stream_section = document.querySelector(".stream_section");
const myVideo = document.createElement("video");
myVideo.muted = true;
myVideo.classList.add("myStream");




function addVideoStream(video, stream) {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
        video.play();
    });
    stream_section.appendChild(video);
};




function connectToOtherUser(userId, stream) {
    const call = peer.call(userId, stream);
    const video = document.createElement("video");
    video.classList.add("otherStream");
    call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream);
    });
    call.on("close", () => {
        video.remove();
    });
};


navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then((stream) => {
    addVideoStream(myVideo, stream);
    peer.on("call", (call) => {
        call.answer(stream);
        const video = document.createElement("video");
        video.classList.add("otherStream");
        call.on("stream", (userVideoStream) => {
            addVideoStream(video, userVideoStream);
        });
    });


    // when first user connect to other user---
    socket.on("user_connected", (userId) => {
        // calling other client and sending stream----
        connectToOtherUser(userId, stream);
    });

}).catch((err) => {
    console.log(err);
});



peer.on("open", (id) => {
    socket.emit("join_room", roomId, id);
});




const mike = document.querySelector(".mike");
mike.addEventListener("click", () => {
    myVideo.play();
    console.log("video on");
});

const camera = document.querySelector(".camera");
camera.addEventListener("click", () => {
    myVideo.pause();
    vid.src = "";
    localstream.getTracks()[0].stop();
    console.log("video off");
});
