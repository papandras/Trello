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
    let select = document.getElementById("mySelect");
    let i = select.selectedIndex;

    await fetch('https://api.trello.com/1/boards/?name=' + name + '&key=' + loggeduser.key + '&token=' + loggeduser.token, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prefs_background: select.options[i].value })
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

let obj = { id: null, element: null };

async function openBoard(id, thiselement) {
    obj.id = id;
    obj.element = thiselement;
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
        let edit = document.createElement("a");
        edit.id = list.id;
        edit.setAttribute("onclick", `editListTitle(this.id)`);
        let img = document.createElement("img");
        img.setAttribute("src", "https://www.pngfind.com/pngs/m/275-2755033_edit-png-file-on-phone-svg-edit-icon.png");
        img.style.height = "30px";
        edit.appendChild(img);
        edit.classList.add("float-end");
        edit.style.position = "relative";
        edit.style.bottom = "4px";
        h2.appendChild(edit);
        let archive = document.createElement("a");
        archive.id = list.id;
        archive.setAttribute("onclick", `archiveList(this.id)`);
        archive.classList.add("float-end");
        archive.style.position = "relative";
        archive.style.bottom = "4px";
        img = document.createElement("img");
        img.setAttribute("src", "https://banner2.cleanpng.com/20191112/jgu/transparent-solid-web-buttons-icon-trash-icon-delete-icon-5dcb353c1c3720.1008941715735985241156.jpg");
        img.style.height = "30px";
        archive.appendChild(img);
        h2.appendChild(archive);
        col.appendChild(div);
        container.appendChild(col);
        fetch(`https://api.trello.com/1/lists/` + list.id + `/cards?key=${loggeduser.key}&token=${loggeduser.token}`).then(response => response.json()).then(data => cards(data, col, list.id));
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

function cards(data, list, listId) {
    let index = 0;
    data.forEach(card => {
        console.log(card);
        div = document.createElement("div");
        div.classList.add("card");
        let text = document.createElement("h5");
        text.innerHTML = card.name;
        text.style.margin = "10px";

        let edit = document.createElement("a");
        edit.id = card.id;
        edit.setAttribute("onclick", `editCardTitle(this.id)`);
        let img = document.createElement("img");
        img.setAttribute("src", "https://www.pngfind.com/pngs/m/275-2755033_edit-png-file-on-phone-svg-edit-icon.png");
        img.style.height = "30px";
        edit.appendChild(img);
        edit.classList.add("float-end");
        text.appendChild(document.createElement("br"));
        text.appendChild(edit);
        let archive = document.createElement("a");
        archive.id = cards.id;
        archive.setAttribute("onclick", `archiveCard(this.id)`);
        archive.classList.add("float-end");
        img = document.createElement("img");
        img.setAttribute("src", "https://banner2.cleanpng.com/20191112/jgu/transparent-solid-web-buttons-icon-trash-icon-delete-icon-5dcb353c1c3720.1008941715735985241156.jpg");
        img.style.height = "30px";
        archive.appendChild(img);
        text.appendChild(archive);


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

    let btn = document.createElement("a");
    btn.classList.add("btn", "btn-secondary", "mb-3");
    btn.innerHTML = "Új kártya";
    btn.id = listId;
    btn.setAttribute("onclick", "addCard(this.id)");
    list.appendChild(btn);

}

async function editCardTitle(id) {
    let content = prompt("Adja meg a kártya új tartalmát!");
    const data = { name: content };
    await fetch(`https://api.trello.com/1/cards/${id}?key=${loggeduser.key}&token=${loggeduser.token}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
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
        openBoard(obj.id, obj.element);
}

function archiveCard(id) {
    //
}

async function addCard(id) {
    let content = prompt("Adja meg a kártya tartalmát!");
    const data = { name: content };
    await fetch('https://api.trello.com/1/cards?idList=' + id + `&key=${loggeduser.key}&token=${loggeduser.token}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
        .then(response => {
            console.log(
                `Response: ${response.status} ${response.statusText}`
            );
            return response.json();
        })
        .then(text => console.log(text))
        .catch(err => console.error(err));

    openBoard(obj.id, obj.element);
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
    await fetch('https://api.trello.com/1/lists/' + id + '?key=' + loggeduser.key + '&token=' + loggeduser.token, {
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
    openBoard(obj.id, obj.element);
}

async function archiveList(id) {
    await fetch('https://api.trello.com/1/lists/' + id + '/closed' + '?key=' + loggeduser.key + '&token=' + loggeduser.token + '&value=' + true, {
        method: 'PUT',
    })
        .then(response => {
            console.log(
                `Response: ${response.status} ${response.statusText}`
            );
            return response.text();
        })
        .then(text => console.log(text))
        .catch(err => console.error(err));
    openBoard(obj.id, obj.element);
}

for (let i = 0; i < document.getElementsByTagName("option").length; ++i) {
    document.getElementsByTagName("option")[i].style.backgroundColor = document.getElementsByTagName("option")[i].value;
}