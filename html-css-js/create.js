var create_dashboard_btn = document.querySelector("#create_dashboard_btn");
create_dashboard_btn.addEventListener("click", () => {
    $('.main_container').load('dashboard.html');
})