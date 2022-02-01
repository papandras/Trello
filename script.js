if (JSON.parse(localStorage.getItem("auth")) == null) {
    localStorage.setItem("auth", false);
}

if (JSON.parse(localStorage.getItem("auth")) == false) {
    document.location.assign("login.html");
}

function kijelentkezes() {
    localStorage.setItem("auth", false);
    document.location.assign("login.html");
}

let tablak = Array();
fetch(`https://api.trello.com/1/members/me/boards?key=ab68071cce6d5327c51aff6ee120a7ed&token=3a03937377c536ac504197988cc3ed254084472039551a846481227f62e71b59`)
    .then(response => {response.json();})
    .then(response => {
        tablak = response;
    }).then(console.log("tablak: " + tablak)).catch(err => console.error(err));