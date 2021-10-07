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
myVideo.width = 200;
myVideo.height = 200;




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
    video.height = 200;
    video.width = 200;
    video.classList.add("otherStream");
    call.on("stream", (userVideoStream) => {
        video.height = 200;
        video.width = 200;
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
            video.height = 200;
            video.width = 200;
            addVideoStream(video, userVideoStream);
        });
    });


    // when first user connect to other user---
    socket.on("user_connected", (userId) => {
        // calling other client and sending stream----
        connectToOtherUser(userId, stream);
    });


    // video audio controls---------------
    const mikeon = document.querySelector(".mikeon");

    mikeon.addEventListener("click", () => {
        stream.getAudioTracks().forEach(track => track.enabled = !track.enabled);

        mikeon.classList.toggle("showClick");

    });


    const videoon = document.querySelector(".videoon");

    videoon.addEventListener("click", () => {
        stream.getVideoTracks().forEach(track => track.enabled = !track.enabled);

        videoon.classList.toggle("showClick");

    });

}).catch((err) => {
    console.log(err);
});


peer.on("open", (id) => {
    socket.emit("join_room", roomId, id);
});

