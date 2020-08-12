document.getElementById("submit_update").addEventListener('click', function(event){
    var req = new XMLHttpRequest();

    var newUserEmail = document.getElementById("changeEmail").value;
    var newPassword = document.getElementById("password").value;
    var userData = {};
    if(newUserEmail == "" && newPassword == ""){
        window.alert("Both fields cannot be empty");
    }
    else if(newUserEmail != "" && newPassword == ""){
        userData = {"email": newUserEmail};
    }
    else if(newUserEmail == "" && newPassword != ""){
        userData = {"password": newPassword};
    }
    else{
        userData = {"email": newUserEmail, "password" : newPassword}
    }
    console.log(userData)
    console.log(window.sessionStorage.getItem('token'));
    req.open("PATCH", "http://localhost:8000/api/users/",  true);
    req.setRequestHeader("Authorization", "Bearer " + window.sessionStorage.getItem('token'));
    req.setRequestHeader('Content-Type', 'application/json')
    req.addEventListener("load", function() {
    if(req.status >= 200 && req.status < 400){
        location.href = "/view_account"
    } 
    else if(req.status == 500){
        window.alert("That email is already in use");
    }else {
        console.log("Something is big wrong.", req.statusText)
    }});
    req.send(JSON.stringify(userData));
    console.log(JSON.stringify(userData));
    event.preventDefault();
})