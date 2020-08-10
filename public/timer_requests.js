var taskdata;
/**
 * This event listener is used to make a GET request for the Tasks table. This request can be found in the /api/tasks.js file
 */
window.addEventListener("load", function(event) {
    var req = new XMLHttpRequest()
    req.open("GET", "http://localhost:8000/api/tasks", true);
    req.setRequestHeader("Authorization", "Bearer " + window.sessionStorage.getItem('token'));
    req.addEventListener("load", function() {
        if(req.status >= 200 && req.status < 400){
            let tasks = JSON.parse(req.responseText);
            console.log(tasks)
        
            tasks.forEach(element => {
              var option = document.createElement("option")
              option.value = element.task_id
              option.text = element.task_name
              option.className = "task-dropdown-option"
              document.getElementById("task-dropdown-header").appendChild(option)
            });
        } else {
            console.log("Something is big wrong.", req.statusText)
            alert("You do not have a valid login token needed to access this page. You will be redirected to the login screen.");
            window.location.href='/';
        }});
    req.send(null)
})

//following variables are used for updating goal completion in the categories tabls
var selectedTaskCompleted;          //integer variable for number of tasks completed in that category
var selectedTaskIsCompleted;        //has the task been completed
var taskCategoryID;                 //ID of category associated with selected task
var selectedTaskGoalTime;           //Goal time of the selected task
var selectedTaskTimeCompleted;      //The time spent working on the selected task
document.getElementById("task-dropdown-header").addEventListener("change", function(event) {
    var req = new XMLHttpRequest()
    var id = document.getElementById("task-dropdown-header").value
    console.log(id)
    req.open("GET", "http://localhost:8000/api/tasks/" + id,  true);
    req.setRequestHeader("Authorization", "Bearer " + window.sessionStorage.getItem('token'));
    req.addEventListener("load", function() {
        if(req.status >= 200 && req.status < 400){
            taskdata = JSON.parse(req.responseText);
            //following set data to the taskdata variable
            selectedTaskCompleted = taskdata.tasks_completed;
            selectedTaskIsCompleted = taskdata.completed;
            taskCategoryID = taskdata.category_id;
            selectedTaskGoalTime = taskdata.time_duration;
            selectedTaskTimeCompleted = taskdata.time_completed;
            console.log(taskCategoryID);
            //console.log(selectedTask)
        } else {
            console.log("Something is big wrong.", req.statusText)
        }});
    req.send(null)
})

/**
 * This PATCH request updates the time spent working on the task using the time spent in session
 */

document.getElementById("timer-stop").addEventListener("click", function(event) {
    var req = new XMLHttpRequest()
    var id = document.getElementById("task-dropdown-header").value;
    
    var oldtime = parseInt(taskdata.time_completed)
    var newtime = oldtime + parseInt(document.getElementById("total_time").value)
    var newdata = {"time_completed": newtime}
    req.open("PATCH", "http://localhost:8000/api/tasks/" + id,  true);
    req.setRequestHeader("Authorization", "Bearer " + window.sessionStorage.getItem('token'));
    req.setRequestHeader('Content-Type', 'application/json')
    req.addEventListener("load", function() {
        if(req.status >= 200 && req.status < 400){
        } else {
            console.log("Something is big wrong.", req.statusText)
        }});
    req.send(JSON.stringify(newdata))
})

/**
 * THis PATCH request updates a task being completed if the goal time was met and the selected task hasn't 
 * been completed before
 */
document.getElementById("timer-stop").addEventListener("click", function(event){
    var req = new XMLHttpRequest()
    var id = taskCategoryID; 
    var oldtime = parseInt(taskdata.time_completed);
    var newtime = oldtime + parseInt(document.getElementById("total_time").value);
    if(((newtime + selectedTaskTimeCompleted) >= selectedTaskGoalTime) && selectedTaskIsCompleted < 1){
        selectedTaskCompleted++;
        var dataSent = {"tasks_completed": selectedTaskCompleted};
        req.open("PATCH", "http://localhost:8000/api/categories/" + id,  true);
        req.setRequestHeader("Authorization", "Bearer " + window.sessionStorage.getItem('token'));
    req.setRequestHeader('Content-Type', 'application/json')
    req.addEventListener("load", function() {
        if(req.status >= 200 && req.status < 400){
        } else {
            console.log("Something is big wrong.", req.statusText)
        }});
    req.send(JSON.stringify(dataSent));
    }
})

/**
 * PATCH request for updating the task being complete if the session time + time spent already is greater
 * than the goal time for the task
 */
document.getElementById("timer-stop").addEventListener("click", function(event) {
    var req = new XMLHttpRequest()
    var id = document.getElementById("task-dropdown-header").value;
    
    var oldtime = parseInt(taskdata.time_completed)
    var newtime = oldtime + parseInt(document.getElementById("total_time").value)
    if((newtime + selectedTaskTimeCompleted) >= selectedTaskGoalTime){
        selectedTaskIsCompleted++;
        var newData = {"completed":selectedTaskIsCompleted};
        req.open("PATCH", "http://localhost:8000/api/tasks/" + id,  true);
        req.setRequestHeader("Authorization", "Bearer " + window.sessionStorage.getItem('token'));
        req.setRequestHeader('Content-Type', 'application/json')
        req.addEventListener("load", function() {
        if(req.status >= 200 && req.status < 400){
        } else {
            console.log("Something is big wrong.", req.statusText)
        }});
    req.send(JSON.stringify(newData))
    }
})