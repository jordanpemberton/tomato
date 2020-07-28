const login = () => {
    document.getElementById("create_user").addEventListener("click", function(event) {
        var payload = getSignUpData();
        if (payload.name == "") {
            return
        }

        var req = new XMLHttpRequest()
        req.open("POST", "http://localhost:8000/api/users", true);
        req.setRequestHeader('Content-Type', 'application/json');
        console.log(payload)
        req.addEventListener("load", function() {
            if(req.status >= 200 && req.status < 400){
                console.log("add success")
                window.location.assign("/signin")
            } else {
                console.log("Something is big wrong.", req.statusText)
            }});
        req.send(JSON.stringify(payload));
        event.preventDefault;
    });
};

const getSignUpData = () => {
    var email = document.getElementById("email").value;
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    

    var newdata = {"username": username, "email": email, "password": password}
    return newdata;

}



document.addEventListener("load", login());
console.log("turtle")