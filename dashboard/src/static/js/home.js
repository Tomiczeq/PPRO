

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

    // search 
    var searchDashboardBtn = document.getElementById("searchDashboardBtn");
    var stopSearchBtn = document.getElementById("stopSearchBtn");
    var searchText = document.getElementById("searchText");
    var liItems = document.querySelectorAll("li");

    searchDashboardBtn.addEventListener("click", () => {
        var text = searchText.value.trim();

        liItems.forEach((liItem) => {
            liItem.classList.remove("hidden");
            var liItemA = liItem.querySelector("a");
            if (!liItemA.textContent.includes(text)) {
                liItem.classList.add("hidden");
            }
        })
    })

    stopSearchBtn.addEventListener("click", () => {
        liItems.forEach((liItem) => {
            liItem.classList.remove("hidden");
        })

        searchText.value = "";
    })
}

init();