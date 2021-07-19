"use strict";

let burger = document.querySelector(".burger");
let burgerLine = document.querySelector(".burger__line");

burger.addEventListener("click", function () {
  burgerLine.classList.toggle("burger__line--active");
});
