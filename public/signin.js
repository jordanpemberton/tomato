
// Init the jtw token object
let userToken;


// Function to login, and set the new jwt token for auth.
const login = () => {

    document.getElementById("try_login").addEventListener("click", function(event) {
        
        // Obtain the values
        var email = document.getElementById("email").value;
        var username = document.getElementById("username").value;
        var password = document.getElementById("password").value;
    
        var newdata = {"username": username, "email": email, "password": password}

        var req = new XMLHttpRequest()
        req.open("POST", "http://localhost:8000/api/users/login", true);
        req.setRequestHeader('Content-Type', 'application/json');
        req.addEventListener("load", function() {
            if(req.status >= 200 && req.status < 400){
                console.log("add success")
                userToken = JSON.parse(req.responseText).token;
                window.sessionStorage.setItem('token', userToken);
                console.log(sessionStorage.getItem('token'));
                location.href = "/view_categories";
            } else {
                // If incorrect data is entered.
                console.log("Something is big wrong.", req.statusText)
                alert("The username or password entered is invalid. Please try again.")
                location.reload()
                
            }});
        req.send(JSON.stringify(newdata));
        
    });
};


document.addEventListener("load", login());
