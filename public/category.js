var categoriesDisplayed = [];

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
    console.log(item.tasks_completed)
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
                location.href = "file:///C:/School/CS361/tomatoTest2/tomato-devin-kepe/views/category.html"
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