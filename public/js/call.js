const socket = io();

const hamburger = document.querySelector(".hamburger");
const hamburger_navMenu = document.querySelector(".hamburger_navMenu");

hamburger.addEventListener("click", () => {
    hamburger_navMenu.classList.toggle("show");
});


if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {

    const peer = new Peer({ host: 'https://ashvideochatapp.herokuapp.com/', port: 443, secure: true })
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
        // video: true,
        video: {
            facingMode: 'user',
            width: 400,
            height: 300,
            frameRate: 10
        },
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


        // video audio controls---------------
        const mikeon = document.querySelector(".mikeon");
        const mikeoff = document.querySelector(".mikeoff");
        const videoon = document.querySelector(".videoon");
        const videooff = document.querySelector(".videooff");


        mikeon.addEventListener("click", () => {
            stream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
            mikeon.style.display = "none";
            mikeoff.style.display = "block";

        });
        mikeoff.addEventListener("click", () => {
            stream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
            mikeon.style.display = "block";
            mikeoff.style.display = "none";
        });

        videoon.addEventListener("click", () => {
            stream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
            videoon.style.display = "none";
            videooff.style.display = "block";

        });

        videooff.addEventListener("click", () => {
            stream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
            videoon.style.display = "block";
            videooff.style.display = "none";
        });

    }).catch((err) => {
        console.log(err);
    });


    peer.on("open", (id) => {
        socket.emit("join_room", roomId, id);
    });

}
else {
    alert("media device not supported");
}

