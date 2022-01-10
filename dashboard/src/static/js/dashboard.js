function showDashConf() {
    document.querySelector(".dashboardHeader").classList.toggle("hidden");
    document.querySelector(".dashConfHeader").classList.toggle("hidden");

    document.querySelector(".rowsContainer").classList.toggle("hidden");
    document.querySelector(".dashConfContainer").classList.toggle("hidden");

    document.getElementById("addRowBtn").classList.toggle("hidden");

}

function hideDashConf() {
    document.querySelector(".dashboardHeader").classList.toggle("hidden");
    document.querySelector(".dashConfHeader").classList.toggle("hidden");

    document.querySelector(".rowsContainer").classList.toggle("hidden");
    document.querySelector(".dashConfContainer").classList.toggle("hidden");

    document.getElementById("addRowBtn").classList.toggle("hidden");
}

function init_dashboard() {
    // enable user to move rows
    $( function() {
        $(".rowsContainer").sortable({
            handle: ".rowMoveHandle",
        });
    })

    // favourite button
    var favBtn = document.getElementById("dashboardFav");
    favBtn.addEventListener("click", () => {
        favBtn.classList.toggle("favourite");
        favBtn.classList.toggle("button");
    })

    // back to dashboard button
    var backBtn = document.getElementById("dashConfBackBtn");
    backBtn.addEventListener("click", () => {
        hideDashConf();
        window.dashboard.currentView = "dashboard";
    });

    // Add row button
    var addRowBtn = document.querySelector("#addRowBtn");
    addRowBtn.addEventListener("click", () => {
        window.dashboard.addNewRow();
    }); 

    // save dashboard button
    var saveBtn = document.querySelector("#saveDashboardBtn");
    saveBtn.addEventListener("click", () => {
        window.dashboard.save();
    }); 

    // actualize dashboard button
    var refreshBtn = document.querySelector("#refreshDashboardBtn");
    refreshBtn.addEventListener("click", () => {
        window.dashboard.updateCharts();
    }); 

    // dashboard settings button
    var dashConfBtn = document.getElementById("dashboardConf");
    dashConfBtn.addEventListener("click", () => {
        window.dashboard.currentView = "dashconf";
        showDashConf();
    })

    // timerange
    var timerangeElem = document.getElementById("queryLast");
    timerangeElem.addEventListener("blur", () => {
        window.dashboard.timerange = timerangeElem.textContent.trim();
        window.dashboard.updateCharts();
    })
    timerangeElem.addEventListener("keydown", function(event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            timerangeElem.blur()
        }
    }); 

    // dashboard settings
    var dashboardNameInp = document.getElementById("dashboardName");
    dashboardNameInp.addEventListener("keydown", () => {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            console.log("enter");
            // Cancel the default action, if needed
            event.preventDefault();
            window.dashboard.name = dashboardNameInp.value.trim();
            var dashboardNames = document.querySelectorAll(".dashboardName");
            dashboardNames.forEach((dashboardName) => {
                dashboardName.textContent = dashboardNameInp.value.trim();
            })
            dashboardNameInp.blur();
        }
    });
    var datasourceInp = document.getElementById("datasourceUrl");
    datasourceInp.addEventListener("keydown", () => {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            var datasourceUrl = datasourceInp.value.trim();
            window.dashboard.url = datasourceUrl;
            window.dashboard.updateCharts();
            datasourceInp.blur();
        }
    });


    
    // get dashboard rows and chart and render them
    window.dashboard.init();
}