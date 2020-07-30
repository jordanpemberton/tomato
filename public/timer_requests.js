var taskdata;

window.addEventListener("load", function(event) {
    var req = new XMLHttpRequest()
    req.open("GET", "http://localhost:8000/api/tasks", true);
    req.setRequestHeader("Authorization", "Bearer " + window.sessionStorage.getItem('token'));
    req.addEventListener("load", function() {
        if(req.status >= 200 && req.status < 400){
            let tasks = JSON.parse(req.responseText);
            tasks.forEach(element => {
              var option = document.createElement("option")
              option.value = element.task_id
              option.text = element.task_name
              option.className = "task-dropdown-option"
              document.getElementById("task-dropdown-header").appendChild(option)
            });
        } else {
            console.log("Something is big wrong.", req.statusText)
        }});
    req.send(null)
})
console.log("turtle")

document.getElementById("task-dropdown-header").addEventListener("change", function(event) {
    var req = new XMLHttpRequest()
    var id = document.getElementById("task-dropdown-header").value
    req.open("GET", "http://localhost:8000/api/tasks/" + id,  true);
    req.setRequestHeader("Authorization", "Bearer " + window.sessionStorage.getItem('token'));
    req.addEventListener("load", function() {
        if(req.status >= 200 && req.status < 400){
            taskdata = JSON.parse(req.responseText);
        } else {
            console.log("Something is big wrong.", req.statusText)
        }});
    req.send(null)
})


document.getElementById("timer-stop").addEventListener("click", function(event) {
    var req = new XMLHttpRequest()
    var id = document.getElementById("task-dropdown-header").value
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


