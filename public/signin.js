function invalidLogin(){
    let invalidLog = false;
    let valid = document.getElementById("exampleInputEmail1").value;
    console.log(valid)
    if(valid != 0){
        invalidLog = false;
    }
    else{
        invalidLog = true;
    }
    if(invalidLog){
        alert("Sorry, that login information doesn't match anything we have. Did you mean to create an account?");
    }
    else{}
    return invalidLog;
}



let sign_up_button = document.getElementById("create account");
sign_up_button.addEventListener('click', function(event){
    event.preventDefault();
    window.location.assign('/signup');
})