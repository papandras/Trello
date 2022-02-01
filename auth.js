let auth = false;
//localStorage.clear();
let users = {
    0 : {
        name: "admin",
        password: "admin",
        email: "admin@gmail.com",
        regdate: "infinity",
    },
}

localStorage.setItem("users", JSON.stringify(users));