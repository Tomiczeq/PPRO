var search_dashboard_btn = document.querySelector("#search_dashboard_btn");
var stop_search_dashboard_btn = document.querySelector("#stop_search_dashboard_btn");
var search_text = document.querySelector("#search_text");
var li_items = document.querySelectorAll(".search_content li");

search_dashboard_btn.addEventListener("click", () => {
    var text = search_text.value.trim();

    li_items.forEach((li_item) => {
        if (li_item.id.includes(text)) {
            li_item.style.display = "flex";
        }
        else {
            li_item.style.display = "none";
        }
    })
})

stop_search_dashboard_btn.addEventListener("click", () => {
    li_items.forEach((li_item) => {
        li_item.style.display = "flex";
    })
})

li_items.forEach((li_item) => {
    li_item.addEventListener("click", () => {
        var page = "dashboard.html";
        $('.main_container').load(page);
    })
})