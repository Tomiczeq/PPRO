// TODO
function hideChartSettings() {
    alert("You have to implement hideChartSettings");
}

// TODO
function showChartSettings() {
    alert("You have to implement showChartSettings");
}

function init_dashboard() {
    // enable user to move rows
    $( function() {
        $(".rows_container").sortable();
    })

    // Add row button
    var addRowBtn = document.querySelector("#add_row_btn");
    addRowBtn.addEventListener("click", () => {
        window.dashboard.addNewRow();
    }); 

    // save dashboard button
    var saveBtn = document.querySelector("#save_dashboard_btn");
    saveBtn.addEventListener("click", () => {
        window.dashboard.save();
    }); 

    // back to dashboard button
    var backBtn = document.getElementById("back_btn");
    backBtn.addEventListener("click", () => {
        hideChartSettings();
        window.dashboard.currentView = "dashboard";
    });

    // get dashboard rows and chart and render them
    window.dashboard.init();
}