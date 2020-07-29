window.addEventListener("load", function(event) {
    var req = new XMLHttpRequest();
    req.open('GET', "http://localhost:8000/api/tasks", true);
    req.setRequestHeader("Authorization", "Bearer " + window.sessionStorage.getItem('token'));
    req.addEventListener('load',function(){
      if(req.status >= 200 && req.status < 400){
        appendcats()
        maketaskonclick()
      } else {
        console.log("Something is big wrong.", req.statusText)
      }});
    req.send(null)
    event.preventDefault
})


const appendcats = () => {
    var req = new XMLHttpRequest()
    req.open("GET", "http://localhost:8000/api/categories", true);
    req.setRequestHeader("Authorization", "Bearer " + window.sessionStorage.getItem('token'));
    req.addEventListener("load", function() {
        if(req.status >= 200 && req.status < 400){
            let cats = JSON.parse(req.responseText);
            cats.forEach(element => {
              var option = document.createElement("option")
              option.value = element.category_id
              option.text = element.category_name
              document.getElementById("category_list").appendChild(option)
            });
        } else {
            console.log("Something is big wrong.", req.statusText)
        }});
    req.send(null)
};


const maketaskonclick = () => {
    document.getElementById("create_task").addEventListener("click", function(event) {
        var payload = gettaskdata();
        if (payload.name == "") {
            return
        }

        var req = new XMLHttpRequest()
        req.open("POST", "http://localhost:8000/api/tasks", true);
        req.setRequestHeader("Authorization", "Bearer " + window.sessionStorage.getItem('token'));
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener("load", function() {
            if(req.status >= 200 && req.status < 400){
                remaketable()
            } else {
                console.log("Something is big wrong.", req.statusText)
            }});
        req.send(JSON.stringify(payload));
        event.preventDefault()
        
    });
};

const gettaskdata = () => {
    var category_id = document.getElementById("category_list").value;
    var task_name = document.getElementById("task_name").value;
    var description = document.getElementById("task_description").value;
    var time_duration = (document.getElementById("task_hours").value * 3600) + (document.getElementById("task_minutes").value * 60)
    

    var newdata = {"category_id" : category_id, "task_name" : task_name, "description" : description, "time_duration" : time_duration}
    return newdata;

}
const remaketable = () => {
var req = new XMLHttpRequest()
    req.open("GET", "http://localhost:8000/api/tasks", true);
    req.setRequestHeader("Authorization", "Bearer " + window.sessionStorage.getItem('token'));
    req.addEventListener("load", function() {
        if(req.status >= 200 && req.status < 400){
            let table = JSON.parse(req.responseText);
            table.forEach(element => {

                makerow(element)
            });
        } else {
            console.log("Something is big wrong.", req.statusText)
        }});
    req.send(null)
};


const makerow = (rowdata) => {


    rt = document.createElement("tr")
    th = document.createElement("th")
    th.scope = "row" ;
    th_text = document.createTextNode(rowdata.category_name) 
    th.appendChild(th_text)
    td = document.createElement("td")
    //td.collapse = "tooltip";
    //td.data-placement = "bottom";
    td.title = rowdata.description;
    td_text = document.createTextNode(rowdata.task_name);
    td.appendChild(td_text)
    let time_goal = return_time(rowdata.time_duration)
    let time_done = return_time(rowdata.time_completed)
    goal_td = document.createElement("td");
    goal_td_text = document.createTextNode(String(time_goal.hours) + ":" + time_goal.minutes);
    goal_td.appendChild(goal_td_text)
    time_td = document.createElement("td");
    time_td_text = document.createTextNode(String(time_done.hours) + ":" + time_done.minutes);
    time_td.appendChild(time_td_text)
    icon_td = document.createElement("td")
    icon = document.createElement("i")
    icon.className = "fa fa-2x fa-check-circle";
    if (time_td.value >= goal_td.value) {
        icon.title = "Goal Met";
        icon.style.color = "#0F9D58";
    }

    else {
        icon.title = "Goal Not Yet Met";
        icon.style.color = "#8e9499";
    };

    icon_td.appendChild(icon)

    rt.appendChild(th)
    rt.appendChild(td)
    rt.appendChild(goal_td)
    rt.appendChild(time_td)
    rt.appendChild(icon_td)

    document.getElementById("table_body").appendChild(rt);

    return



};


const return_time = (seconds) => {
    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor(seconds % 3600 / 60);
    if (minutes < 10) {
        minutes = "0" + String(minutes)
    }
    else {
        minutes = String(minutes)
    }
    var data = {"hours" : hours, "minutes" : minutes}

    return data

}

window.addEventListener("load", remaketable());