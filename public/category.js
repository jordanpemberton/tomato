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

var tasksInCategory = [];
function fillTasksInCategory(){
    window.addEventListener('load', function(event){
        var req = new XMLHttpRequest();
        req.open('GET', 'http://localhost:8000/api/tasks', true);
        req.setRequestHeader("Authorization", "Bearer " + window.sessionStorage.getItem('token'));
        req.addEventListener('load', function(){
           if(req.status >= 200 && req.status < 400){
                tasksInCategory = JSON.parse(req.responseText); 
            }
            else {
                alert("You do not have a valid login token needed to access this page. You will be redirected to the login screen.");
                window.location.href='/';
            }
        }) 
        req.send(null);
        event.preventDefault;
    })
}

function fillTimeSpentDictionary(responseObject, fillObject,){
    responseObject.forEach(category=> {
        if(fillObject[category.category_name]){
            fillObject[category.category_name] += category.time_completed;
        }
        else{
            fillObject[category.category_name] = category.time_completed;
        }
    })
    return fillObject;
}

function fillTasksCompleteDictionary(responseObject, fillObject){
    responseObject.forEach(category=> {
        if(fillObject[category.category_name]){
            fillObject[category.category_name] = category.tasks_completed;
        }
        else{
            fillObject[category.category_name] = category.tasks_completed;
        }
    })
    return fillObject;
}
function populateCharts(){
    window.addEventListener('load', function(event){
        var categoriesDisplayed = [];
        var req = new XMLHttpRequest();
        req.open('GET', 'http://localhost:8000/api/categories', true);
        req.setRequestHeader("Authorization", "Bearer " + window.sessionStorage.getItem('token'));
        req.addEventListener('load', function(){
            if(req.status >= 200 && req.status < 400){
                categoriesDisplayed = JSON.parse(req.responseText);
                categoriesDisplayed.forEach(addToTable);
                categoriesDisplayed.forEach(updateCategories);
                console.log(tasksInCategory)
                let tasks = {}
                tasks = fillTimeSpentDictionary(tasksInCategory, tasks);
            

                let categories = {};
                categories = fillTasksCompleteDictionary(tasksInCategory, categories);
            

                let barChartArray = Object.values(tasks);
                barChartArray.forEach(function(item, index){
                    barChartArray[index] = (item / 60);
                })
                let categoryNames = Object.keys(tasks);
                let numberOfTasksCompleted = Object.values(categories);

            
                /****************************************************************************************
                 * Original Author: Jordan Pemberton
                 * Original File: /public/categories.js
                ****************************************************************************************/
                // Chart Elements:
                const barChart = document.querySelector('#chart1').getContext('2d');
                const pieChart = document.querySelector('#chart2').getContext('2d');

                const colorPalette = [  '#d62d20', '#ff5400', '#80b918', '#008744', '#02c39a', '#2a9d8f', '#5f0f40', 
                            '#e63946', '#390099', '#ffa700', '#ff0054', '#25badf', '#ef6412', '#55006a', '#0057e7' ];

            
                // Pick Colors:
                let {transpColors, solidColors} = assignColors(Object.keys(categories).length);

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
                        labels: categoryNames,
                        datasets: [{
                            data: barChartArray,
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
                                    labelString: 'Time Spent (in min)'
                                },
                                ticks: {
                                    beginAtZero: true
                                }
                            }],
                            xAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Category Name'
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
                            labels: categoryNames,
                            datasets: [{
                                data: numberOfTasksCompleted,
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
                            },
                            title: {
                                position: 'top',
                                display: true,
                                text: 'Number of Tasks Completed Per Category'
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
}
/****************************************************
 * End of Jordan's Code
 ***************************************************/

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


document.addEventListener("load", fillTasksInCategory());
document.addEventListener("load", populateCharts());
document.addEventListener("load", login());
