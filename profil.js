let date, loggeduser = JSON.parse(localStorage.getItem("loggeduser"));

if(typeof(loggeduser.regdate) != "string"){
    date = new Date(loggeduser.regdate).toISOString().slice(0,10);
}else{
    date = loggeduser.regdate;
}

document.getElementsByTagName("h2")[1].innerHTML = loggeduser.name;
document.querySelectorAll("p > b:nth-child(1)")[0].innerHTML += " " + loggeduser.email;
document.querySelectorAll("p > b:nth-child(1)")[1].innerHTML += " " + date;