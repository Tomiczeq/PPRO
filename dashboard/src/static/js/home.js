

function init() {

    // show and hide results
    var favDashBtns = document.querySelectorAll(".favDashBtn");
    favDashBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
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
    var liItems = document.querySelectorAll("li");
    var searchText = document.getElementById("searchText");
    searchText.addEventListener("keydown", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            var text = searchText.value.trim();

            liItems.forEach((liItem) => {
                liItem.classList.remove("hidden");
                var liItemA = liItem.querySelector("a");
                if (!liItemA.textContent.includes(text)) {
                    liItem.classList.add("hidden");
                }
            })
        }
    });
}

init();