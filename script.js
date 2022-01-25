if(JSON.parse(localStorage.getItem("auth")) == false){
    document.location.assign("login.html");
}

function kijelentkezes(){
    localStorage.setItem("auth", false);
    document.location.assign("login.html");
}