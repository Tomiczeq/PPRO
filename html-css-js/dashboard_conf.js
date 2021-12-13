var dashconf_nav_items = document.querySelectorAll(".dashconf_nav_li");
var dashconf_containers = document.querySelectorAll(".dashboard_conf_content");

dashconf_nav_items.forEach((nav_item) => {

    nav_item.addEventListener("click", () => {

        dashconf_containers.forEach((dashconf_container) => {
            dashconf_container.style.display = "none";    
        })

        var current_container_id = nav_item.id.replace("btn", "container").trim();
        var current_container = document.getElementById(current_container_id);
        current_container.style.display = "block";

    })
})

dashconf_nav_items.forEach((li_item) => {
    li_item.addEventListener("click", () => {

        dashconf_nav_items.forEach((item) => {
            item.classList.remove("dashconf_nav_li");
            item.classList.remove("dashconf_nav_li_selected");
            item.classList.add("dashconf_nav_li");
        })
        li_item.classList.remove("dashconf_nav_li");
        li_item.classList.remove("dashconf_nav_li_selected");
        li_item.classList.add("dashconf_nav_li_selected");
    })
})


// docasny mock chart
var options = {
    chart: {
        animations: {
            enabled: false
        },
        redrawOnParentResize: true,
        height: "200px",
        width: "300px",
        toolbar: {
            show: false,
            tools: {
              download: false,
              selection: false,
              zoom: false,
              zoomin: false,
              zoomout: false,
              pan: false,
              reset: false,
              customIcons: []
            },
        },
    },
    series: [{
            type: 'line',
            name: 'neco',
            data: [[1, 34], [3, 54], [5, 23] , [15, 43]]
        }, {
            type: 'line',
            name: 'takyneco',
            data: [[1, 14], [2, 24], [5, 23] , [15, 33]]
        }
    ], 
}
var chart = new ApexCharts(document.querySelector('.chart'), options);
chart.render();