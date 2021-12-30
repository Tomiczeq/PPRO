

function init() {

    // show and hide results
    var favDashBtns = document.querySelectorAll(".favDashBtn");
    favDashBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            console.log("click");
            favDashBtns.forEach((btnn) => {
                btnn.classList.toggle("hidden")
            })
            document.querySelector(".favDashboards").classList.toggle("hidden");
        })
    });
    var allDashBtns = document.querySelectorAll(".allDashBtn");
    allDashBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            allDashBtns.forEach((btn) => {
                btn.classList.toggle("hidden")
            })
            document.querySelector(".allDashboards").classList.toggle("hidden");
        })
    });
}

init();