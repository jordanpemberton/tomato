let userToken;

const login = () => {

    document.getElementById("try_login").addEventListener("click", function(event) {
        var payload = getSignUpData();
        if (payload.name == "") {
            return
        }

        var req = new XMLHttpRequest()
        req.open("POST", "http://localhost:8000/api/users/login", true);
        req.setRequestHeader('Content-Type', 'application/json');
        console.log(payload)
        req.addEventListener("load", function() {
            if(req.status >= 200 && req.status < 400){
                console.log("add success")
                userToken = JSON.parse(req.responseText).token;
                window.sessionStorage.setItem('token', userToken);
                console.log(sessionStorage.getItem('token'));
                location.href = "/view_categories";
            } else {
                console.log("Something is big wrong.", req.statusText)
            }});
        req.send(JSON.stringify(payload));
        
    });
};

const getSignUpData = () => {
    console.log("hello there");
    var email = document.getElementById("email").value;
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    

    var newdata = {"username": username, "email": email, "password": password}
    return newdata;

}



document.addEventListener("load", login());
console.log("turtle")