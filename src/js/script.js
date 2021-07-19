"use strict";

let burger = document.querySelector(".burger");
let burgerLine = document.querySelector(".burger__line");
let menu = document.querySelector(".menu");

burger.addEventListener("click", function () {
  burgerLine.classList.toggle("burger__line--active");
  menu.classList.toggle("menu--active");
});
