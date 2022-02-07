if (loggeduser.key == null && loggeduser.token == null) {
    document.getElementById("main-container").style.display = "block";
    document.getElementsByClassName("alert-success")[0].style.display = "block";
}

/**
 * Táblák lekérése
 */

async function getBoards() {
    let response = await fetch("https://api.trello.com/1/members/me/boards?key=" + loggeduser.key + "&token=" + loggeduser.token);
    let data = await response.json();

    document.getElementById("main-container").innerHTML = "";
    let template = document.getElementsByTagName("template")[0].content;
    for (let tabla of Object.values(data)) {
        card = document.importNode(template, true);
        //card.style.backgroundColor = tabla.prefs.backgroundColor;
        card.querySelector("h5").innerText = tabla.name;
        card.getElementById("delete").id = tabla.id;
        card.getElementById("edit").id = tabla.id;
        card.getElementById("open").id = tabla.id;
        if (tabla.dateLastActivity != null) {
            card.querySelector("p").innerText += tabla.dateLastActivity.slice(0, 10) ?? "-";
        }
        else {
            card.querySelector("p").innerText += "-";
        }
        document.getElementById("main-container").appendChild(card);
        if (tabla.prefs.backgroundColor != null) {
            document.getElementById("main-container").getElementsByClassName("card")[document.getElementsByClassName("card").length - 1].style.backgroundColor = tabla.prefs.backgroundColor;
        } else {
            document.getElementById("main-container").getElementsByClassName("card")[document.getElementsByClassName("card").length - 1].style.backgroundImage = `url(${tabla.prefs.backgroundImage})`;
        }

    }
}

/**
 * Tábla törlése dialog
 */

function deleteDialog(id) {
    document.getElementsByClassName("alert-danger")[0].style.display = "block";
    document.getElementsByClassName("btn-danger")[0].setAttribute("id", id);

}

/**
 * Tábla törlése dialog bezárása
 */

function deleteDialogClose() {
    document.getElementsByClassName("alert-danger")[0].style.display = "none";
}

/**
 * Tábla törlése
 * @param {*} id 
 */
async function deleteBoard(id) {
    document.getElementsByClassName("alert-danger")[0].style.display = "none";
    await fetch('https://api.trello.com/1/boards/' + id + '?key=' + loggeduser.key + '&token=' + loggeduser.token, {
        method: 'DELETE'
    })
        .then(response => {
            console.log(
                `Response: ${response.status} ${response.statusText}`
            );
            return response.text();
        })
        .then(text => console.log(text))
        .catch(err => console.error(err));
    getBoards();
}

/**
 * Tábla létrehozása
 * @param {*} name 
 */

async function createBoard(name) {
    await fetch('https://api.trello.com/1/boards/?name=' + name + '&key=' + loggeduser.key + '&token=' + loggeduser.token, {
        method: 'POST'
    })
        .then(response => {
            console.log(
                `Response: ${response.status} ${response.statusText}`
            );
            return response.text();
        })
        .then(text => console.log(text))
        .catch(err => console.error(err));
    getBoards();
}

/**
 * Új tábla neve ablak
 */

function boardname() {
    document.getElementsByClassName("alert-info")[0].style.display = "block";
    //document.getElementsByClassName("alert-info")[0].classList.add("typeBoardName");
}

/**
 * Új tábla elmentése
 */

function saveboardname() {
    if (document.getElementById("nameCreate").value != "") {
        document.getElementsByClassName("alert-info")[0].style.display = "none";
        createBoard(document.getElementById("nameCreate").value);
        document.getElementById("nameCreate").value = null;
        document.getElementsByClassName("alert-info")[0].getElementsByTagName("p")[0].innerHTML = "<br>";
    } else {
        document.getElementsByClassName("alert-info")[0].getElementsByTagName("p")[0].innerHTML = "Add meg a kívánt nevet!";
    }
}

/**
 * Új tábla ablak bezárása
 */

function closesaveboardname() {
    document.getElementsByClassName("alert-info")[0].style.display = "none";
    document.getElementById("nameCreate").value = null;
}

/**
 * Megnyitott tábla bezárása
 */

function boardClose() {
    document.querySelector("#lists").style.display = "none";
}

function editBoardDialog(id) {
    document.querySelector(".alert-success").style.display = "block";
    document.querySelector(".alert-success").setAttribute("id", id);
}

async function editBoard() {
    const data = { name: document.getElementById("nameEdit").value };

    let id = document.querySelector(".alert-success").id;
    document.querySelector(".alert-success").style.display = "none";

    await fetch('https://api.trello.com/1/boards/' + id + `?key=${loggeduser.key}&token=${loggeduser.token}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            console.log(
                `Response: ${response.status} ${response.statusText}`
            );
            return response.text();
        })
        .then(text => console.log(text))
        .catch(err => console.error(err));
    getBoards();
    document.getElementById("nameEdit").value = "";
}

function closeEditBoard() {
    document.querySelector(".alert-success").style.display = "none";
    document.getElementById("nameEdit").value = "";
}

/**
 * Tábla megnyitása
 * @param {*} id 
 * @param {*} thiselement 
 */

async function openBoard(id, thiselement) {
    let openedboard;
    await fetch(`https://api.trello.com/1/boards/` + id + `/lists?key=${loggeduser.key}&token=${loggeduser.token}`, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => {
            //console.log(
            //    `Response: ${response.status} ${response.statusText}`
            //);
            return response.json();
        })
        .then(text => {
            openedboard = text;
            //console.log(text)
        })
        .catch(err => console.error(err));
    megjelenit(openedboard, thiselement.parentElement.parentElement.querySelector("h5").textContent);
}

/**
 * Tábla megjelenítése
 * @param {*} data 
 * @param {*} title 
 */

function megjelenit(data, title) {
    let container = document.querySelector("#lists>.row");
    container.innerHTML = null;
    document.querySelector("#lists").style.display = "block";

    let h1 = document.createElement("h1");
    h1.classList.add("text-center", "text-dark");
    h1.innerHTML = title;
    container.appendChild(h1);
    container.appendChild(document.createElement("hr"));
    let listIndex = 0;
    console.log(Math.round(12 / data.length));
    let colcount = Math.round(12 / data.length);
    if (colcount < 3) {
        colcount = 3;
    }
    data.forEach(list => {
        console.log(list);
        let col = document.createElement("div");
        col.classList.add("col", `col-${colcount}`);
        let div = document.createElement("div");
        let h2 = document.createElement("h2");
        h2.innerHTML = list.name;
        div.appendChild(h2);
        h2.style.backgroundColor = "grey"
        div.classList.add("list");
        div.id = listIndex;
        let a = document.createElement("button");
        a.id = list.id;
        a.setAttribute("onclick", `editListTitle(this.id)`);
        let img = document.createElement("img");
        img.setAttribute("src", "https://i.pinimg.com/originals/9c/d4/56/9cd456422c28ea2fb095b5707891670f.png");
        img.style.width = "30px";
        a.appendChild(img);
        col.appendChild(a);
        col.appendChild(div);
        container.appendChild(col);
        fetch(`https://api.trello.com/1/lists/` + list.id + `/cards?key=${loggeduser.key}&token=${loggeduser.token}`).then(response => response.json()).then(data => cards(data, col));
        listIndex += 1;
    });
    closeButton = document.createElement("a");
    closeButton.href = "#";
    closeButton.classList.add("btn", "btn-primary", "d-block", "col-2", "offset-10", "my-3");
    closeButton.style.width = "200px";
    closeButton.style.display = "block";
    closeButton.innerHTML = "Bezárás";
    closeButton.setAttribute("onclick", "boardClose()");
    let buttonrow = document.createElement("div");
    buttonrow.classList.add("row", "text-center");
    buttonrow.appendChild(closeButton);

    container.appendChild(buttonrow);
}

/**
 * Kártyák megjelenítése
 * @param {*} data 
 * @param {*} list 
 */

function cards(data, list) {
    let index = 0;
    data.forEach(card => {
        let div = document.createElement("div");
        div.classList.add("card");
        let text = document.createElement("h5");
        text.innerHTML = card.name;
        text.style.margin = "10px";
        div.appendChild(text);
        list.appendChild(div);
        if (index == 0) {
            div.classList.add("elsoKartya");
        }
        if (index == data.length - 1) {
            div.classList.add("utolsoKartya");
        }
        ++index;
    });
}

/**
 * Tábla nevének szerkesztése
 * @param {*} name 
 */


async function updateBoard(name) {
    await fetch('https://api.trello.com/1/boards/?name=' + name + '&key=' + loggeduser.key + '&token=' + loggeduser.token, {
        method: 'UPDATE'
    })
        .then(response => {
            console.log(
                `Response: ${response.status} ${response.statusText}`
            );
            return response.text();
        })
        .then(text => console.log(text))
        .catch(err => console.error(err));
    getBoards();
}

async function editListTitle(id) {
    let newname = prompt("Adja meg az oszlop új nevét!");
    const data = { name: newname };
    fetch('https://api.trello.com/1/lists/' + id + '?key=' + loggeduser.key + '&token=' + loggeduser.token, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            console.log(
                `Response: ${response.status} ${response.statusText}`
            );
            return response.text();
        })
        .then(text => console.log(text))
        .catch(err => console.error(err));
}