localStorage.setItem("auth", false);
let loggeduser = null;

function navbar_bejelentkezes() {
    document.getElementById("form_bejelentkezes").style.display = "block";
    document.getElementById("form_regisztracio").style.display = "none";
}
function navbar_regisztracio() {
    document.getElementById("form_bejelentkezes").style.display = "none";
    document.getElementById("form_regisztracio").style.display = "block";
}

function submit_bejelentkezes() {
    let valid = false;
    for (let user of Object.values(JSON.parse(localStorage.getItem("users")))) {
        if (user.name == document.getElementById("felhasznalonev_bejelentkezes").value && user.password == document.getElementById("jelszo_bejelentkezes").value) {
            valid = true;
            loggeduser = user;
            localStorage.setItem("loggeduser", JSON.stringify(loggeduser));
            break;
        }
    }
    if (valid == true) {
        localStorage.setItem("auth", true);
        document.location.href = "index.html";
    }
    else {
        document.getElementsByClassName("alert")[0].getElementsByTagName("p")[0].textContent = "Hibás felhasználónév vagy jelszó!";
        document.getElementsByClassName("alert")[0].style.display = "block";
    }
    return false;
}

function submit_regisztracio() {
    if (document.getElementById("jelszo_regisztracio").value === document.getElementById("jelszo_megerosit_regisztracio").value) {
        let newuser = {
            id: Object.keys(users).length,
            name: document.getElementById("felhasznalonev_regisztracio").value,
            password: document.getElementById("jelszo_regisztracio").value,
            email: document.getElementById("email_regisztracio").value,
            regdate: Date.now(),
            key: null,
            token: null,
        }
        users[Object.keys(users).length] = newuser;
        let i = 0;
        for (let user of Object.keys(JSON.parse(localStorage.getItem("users")))) {
            ++i;
        }
        users[i] = newuser;
        localStorage.setItem("users", JSON.stringify(users));

        document.getElementsByClassName("alert")[0].getElementsByTagName("p")[0].textContent = "Sikeres regisztráció!";
        document.getElementsByClassName("alert")[0].style.display = "block";
    }
    else {
        document.getElementsByClassName("alert")[0].getElementsByTagName("p")[0].textContent = "A jelszavak nem egyeznek!";
        document.getElementsByClassName("alert")[0].style.display = "block";
    }


    return false;
}

function bezaras() {
    document.getElementsByClassName("alert")[0].style.display = "none";
}