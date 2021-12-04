var settings_li_items = document.querySelectorAll(".settings_navbar ul li");
var settings_content_divs = document.querySelectorAll(".settings_content");
var datasources_btn = document.querySelector("#datasources_btn");
var users_btn = document.querySelector("#users_btn");

settings_li_items.forEach((li_item) => {
    li_item.addEventListener("click", () => {

        settings_li_items.forEach((item) => {
            item.classList.remove("settings_navbar_li");
            item.classList.remove("settings_navbar_li_selected");
            item.classList.add("settings_navbar_li");
        })
        li_item.classList.remove("settings_navbar_li");
        li_item.classList.remove("settings_navbar_li_selected");
        li_item.classList.add("settings_navbar_li_selected");
    })
})

datasources_btn.addEventListener("click", () => {

    settings_content_divs.forEach((div_item) => {
        div_item.style.display = "none";
    })

    var datasources_div = document.querySelector("#datasources_container");
    datasources_div.style.display = "block";

})
users_btn.addEventListener("click", () => {

    settings_content_divs.forEach((div_item) => {
        div_item.style.display = "none";
    })

    var users_div = document.querySelector("#users_container");
    users_div.style.display = "block";

})