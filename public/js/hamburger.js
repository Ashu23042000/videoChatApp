const hamburger = document.querySelector(".hamburger");
const hamburger_navMenu = document.querySelector(".hamburger_navMenu");

hamburger.addEventListener("click", () => {
    hamburger_navMenu.classList.toggle("show");
});