let auth = false;

let users = {
    0 : {
        name: "admin",
        password: "admin",
        email: "admin@gmail.com",
    },
}

localStorage.setItem("users", JSON.stringify(users));