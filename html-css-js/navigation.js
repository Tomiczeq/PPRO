var li_items = document.querySelectorAll(".sidebar ul li");
var hamburger = document.querySelector(".hamburger");
var wrapper = document.querySelector(".wrapper");

var settings_btn = document.querySelector("#settings_btn");
var create_btn = document.querySelector("#create_btn");
var search_btn = document.querySelector("#search_btn");
var logout_btn = document.querySelector("#logout_btn");


li_items.forEach((li_item) => {
    li_item.addEventListener("mouseenter", () => {
        if (wrapper.classList.contains("click_collapse")) {
            return;
        }
        else {
            li_item.closest(".wrapper").classList.remove("hover_collapse");
        }
    })
})

li_items.forEach((li_item) => {
    li_item.addEventListener("mouseleave", () => {
        if (wrapper.classList.contains("click_collapse")) {
            return;
        }
        else {
            li_item.closest(".wrapper").classList.add("hover_collapse");
        }
    })
})

hamburger.addEventListener("click", () => {
    hamburger.closest(".wrapper").classList.toggle("click_collapse");
    hamburger.closest(".wrapper").classList.toggle("hover_collapse");
})

settings_btn.addEventListener("click", () => {
    $(".main_container").load("settings.html")
})
search_btn.addEventListener("click", () => {
    $(".main_container").load("search.html")
})
create_btn.addEventListener("click", () => {
    $(".main_container").load("create.html")
})
logout_btn.addEventListener("click", () => {
    alert("heyyyyy");
})