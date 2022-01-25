localStorage.setItem("auth", false);

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
            break;
        }
    }
    if (valid == true) {
        localStorage.setItem("auth", true);
        document.location.href = "index.html";
    }
    else {
        alert("Nincs ilyen regisztrált felhasználó!");
    }
    return false;
}