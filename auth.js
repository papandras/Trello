/**
 * Első betöltésnél admin  felhasználó létrehozása és eltárolása
 * @counter - csak arra kell hogy számolja a belépéseket a fenti okból
 * @auth - be van-e lépve valaki
 * @users - felhasználók eltárolása
 */
if (JSON.parse(localStorage.getItem("counter")) == null) {
    localStorage.setItem("counter", 0);
}
let auth = false;

let users = {
    0 : {
        id: 0,
        name: "admin",
        password: "admin",
        email: "admin@gmail.com",
        regdate: "infinity",
        key: null,
        token: null,
    },
}

if (JSON.parse(localStorage.getItem("counter")) == 0) {
    localStorage.setItem("users", JSON.stringify(users));
}

let counter = parseInt(JSON.parse(localStorage.getItem("counter")));
localStorage.setItem("counter", ++counter);