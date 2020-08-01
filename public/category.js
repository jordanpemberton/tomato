var categoriesDisplayed = [];
var categoryArray = []
function addToTable(item){
    let myTable = document.getElementById("category_table");
    let row = document.createElement("tr");
    myTable.appendChild(row);
    let cell = document.createElement("th");
    let value = row.appendChild(cell);
    value.innerText = `${item.category_name}`;
}

function updateCategories(item){
    let myTable = document.getElementById("goals_met");
    let row = document.createElement("tr");
    let cell = document.createElement("td");
    let cell2 = document.createElement("td");
    myTable.appendChild(row);
    let value = row.appendChild(cell);
    row.appendChild(cell2);
    value.innerText = `${item.category_name}`;
    for(i = 0; i < item.tasks_completed; i++){
        let check = document.createElement('i');
        check.className ="fa fa-2x fa-check-circle";
        check.style.color = "#0F9D58";
        cell2.append(check);
    }
}

window.addEventListener('load', function(event){
    var req = new XMLHttpRequest();
    req.open('GET', 'http://localhost:8000/api/categories', true);
    req.setRequestHeader("Authorization", "Bearer " + window.sessionStorage.getItem('token'));
    req.addEventListener('load', function(){
        if(req.status >= 200 && req.status < 400){
            categoriesDisplayed = JSON.parse(req.responseText);
            categoriesDisplayed.forEach(addToTable);
            categoriesDisplayed.forEach(updateCategories);
            /****************************************************************************************
             * Original Author: Jordan Pemberton
             * Original File: /public/categories.js
            ****************************************************************************************/
            // Chart Elements:
            const barChart = document.querySelector('#chart1').getContext('2d');
            const pieChart = document.querySelector('#chart2').getContext('2d');

            const colorPalette = [  '#d62d20', '#ff5400', '#80b918', '#008744', '#02c39a', '#2a9d8f', '#5f0f40', 
                        '#e63946', '#390099', '#ffa700', '#ff0054', '#25badf', '#ef6412', '#55006a', '#0057e7' ];

            // Get categories and Tasks completed
            let categories = [];
            for(i = 0; i < categoriesDisplayed.length; i++){
                categories[i] = categoriesDisplayed[i].category_name;
            }
            let categoryTasksCompleted = [];
            for(i = 0; i < categoriesDisplayed.length; i++){
                categoryTasksCompleted[i] = categoriesDisplayed[i].tasks_completed;
            }
            console.log(categories);
            // Pick Colors:
            let {transpColors, solidColors} = assignColors(categoryTasksCompleted.length);

            // Make Color Palletes:
            function assignColors(dataLen) {
                let transpColors = [];
                let solidColors = [];
                let pLen = colorPalette.length;
                for (i=0; i<dataLen; i++) {
                    let transpColor = colorPalette[i%pLen] + '74';
                    let solidColor = colorPalette[i%pLen];
                    transpColors.push(transpColor); 
                    solidColors.push(solidColor);
                }
                return {transpColors, solidColors};
            }   


            function makeBarChart(canvas) {
                new Chart(canvas, {
                    type: 'bar',
                    data: {
                    labels: categories,
                    datasets: [{
                        data: categoryTasksCompleted,
                        backgroundColor: transpColors,
                        borderColor: solidColors,
                        borderWidth: 2
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            scaleLabel: {
                                display: true,
                                labelString: 'Tasks Completed'
                            },
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    },
                    legend: {
                        display: false
                    }
                }
                });
            }

            function makeDoughnutChart(canvas) {
                new Chart(canvas, {
                    type: 'doughnut',
                    data: {
                        labels: categories,
                        datasets: [{
                            data: categoryTasksCompleted,
                            backgroundColor: solidColors
                        }]
                    },
                    options: { 
                        cutoutPercentage: 35,
                        legend: {
                            display: true,
                            position: 'right',
                            align: 'right',
                            labels: {
                            boxWidth: 12
                            }
                        }
                    }
                });
            }   


        makeBarChart(barChart);
        makeDoughnutChart(pieChart);
        }
        else{
        }
    });
    req.send(null);
    event.preventDefault;
})



const login = () => {
    document.getElementById("create_category").addEventListener("click", function(event) {
        var payload = getCategoryData();
        if (payload.name == "") {
            return
        }

        var req = new XMLHttpRequest()
        req.open("POST", "http://localhost:8000/api/categories", true);
        req.setRequestHeader("Authorization", "Bearer " + window.sessionStorage.getItem('token'));
        req.setRequestHeader('Content-Type', 'application/json');
        console.log(payload)
        req.addEventListener("load", function() {
            if(req.status >= 200 && req.status < 400){
                console.log("add success")
                location.href = "/view_categories"
            } else {
                console.log("Something is big wrong.", req.statusText)
            }});
        req.send(JSON.stringify(payload));
    });
};

const getCategoryData = () => {
    var categoryName = document.getElementById("category").value;
    var categoryData = {"category_name": categoryName};
    return categoryData;

}



document.addEventListener("load", login());
