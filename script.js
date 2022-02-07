/**
 * Ha nincs bejelentkezve senki akkor minden oldal kidob a login oldalra
 */
 {
    if (JSON.parse(localStorage.getItem("auth")) == null) {
        localStorage.setItem("auth", false);
    }

    if (JSON.parse(localStorage.getItem("auth")) == false) {
        document.location.assign("login.html");
    }
}

/**
 * Kijelentkezés
 */

{
    function kijelentkezes() {
        localStorage.setItem("auth", false);
        document.location.assign("login.html");
        localStorage.setItem("loggeduser", null);
    }
}

let loggeduser = JSON.parse(localStorage.getItem("loggeduser"));

/**
 * Kulcs és token megadása form megjelenésének szabályozása
 * @loggeduser - belépett felhasználó
 */

{
    if (loggeduser.key == null && loggeduser.token == null) {
        document.getElementsByClassName("form")[0].style.display = "block";
        document.getElementsByClassName("alert-success")[0].style.display = "none";
    }

    if (loggeduser.key != null && loggeduser.token != null) {
        document.getElementsByClassName("form")[0].style.display = "none";
        document.getElementsByClassName("alert-success")[0].style.display = "block";
    }
}

/**
 * Kulcs és token megadása form
 */

{
    function addKeyToken() {
        let key = document.getElementById("key").value;
        let token = document.getElementById("token").value;
        if (key == "" || token == "") {
            document.getElementsByClassName("alert")[0].getElementsByTagName("p")[0].textContent = "Kulcs vagy token nem lett megadva!";
            document.getElementsByClassName("alert")[0].style.display = "block";
        }
        else {
            var addkeytokentothisuser = loggeduser;

            addkeytokentothisuser.key = key;
            addkeytokentothisuser.token = token;

            alluser = JSON.parse(localStorage.getItem("users"));
            alluser[addkeytokentothisuser.id] = addkeytokentothisuser;
            localStorage.setItem("users", JSON.stringify(alluser));
            localStorage.setItem("loggeduser", JSON.stringify(loggeduser));

            document.getElementsByClassName("alert")[0].getElementsByTagName("p")[0].textContent = "Kulcs és token sikeresen megadva!";
            document.getElementsByClassName("alert")[0].style.display = "block";

            document.getElementsByClassName("form")[0].style.display = "none";
            document.getElementsByClassName("alert-success")[0].style.display = "block";
        }
    }

    function bezaras() {
        document.getElementsByClassName("alert")[0].style.display = "none";
    }
}