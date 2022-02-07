async function getBoards() {
    let response = await fetch("https://api.trello.com/1/members/me/boards?key=" + loggeduser.key + "&token=" + loggeduser.token);
    let data = await response.json();

    document.getElementById("main-container").innerHTML = "";
    let template = document.getElementsByTagName("template")[0].content;
    for (let tabla of Object.values(data)) {
        card = document.importNode(template, true);
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
    }

    //for (let i = 0; i < document.getElementsByClassName("open").length; i++) {
    //    document.getElementsByClassName("open")[i].setAttribute("href", "tablaAdat.html?id=" + document.getElementsByClassName("open")[i].id)
    //}
}

getBoards();

if (loggeduser.key == null && loggeduser.token == null) {
    document.getElementById("main-container").style.display = "block";
    document.getElementsByClassName("alert-success")[0].style.display = "block";
}

async function deleteBoard(id) {
    await fetch('https://api.trello.com/1/boards/' + id + '?key=' + loggeduser.key + '&token=' + loggeduser.token, {
        method: 'DELETE'
    })
}

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

function boardname() {
    document.getElementsByClassName("alert-info")[0].style.display = "block";
    document.getElementsByClassName("alert-info")[0].classList.add("typeBoardName");
}

function saveboardname() {
    if (document.getElementById("name").value != "") {
        document.getElementsByClassName("alert-info")[0].style.display = "none";
        createBoard(document.getElementById("name").value);
        document.getElementById("name").value = null;
        document.getElementsByClassName("alert-info")[0].getElementsByTagName("p")[0].innerHTML = "<br>";
    } else {
        document.getElementsByClassName("alert-info")[0].getElementsByTagName("p")[0].innerHTML = "Add meg a kívánt nevet!";
    }
}

function closesaveboardname() {
    document.getElementsByClassName("alert-info")[0].style.display = "none";
    document.getElementById("name").value = null;
}

async function openBoard(id) {
    await fetch('https://api.trello.com/1/boards/' + id + '?key=' + loggeduser.key + '&token=' + loggeduser.token, {
        method: 'GET',
        headers: {
            'Accept': 'application/json'
        }
    })
        .then(response => {
            console.log(
                `Response: ${response.status} ${response.statusText}`
            );
            return response.text();
        })
        .then(text => localStorage.setItem("currentBoard", JSON.stringify(text)))
        .then(console.log(JSON.parse(localStorage.getItem("currentBoard"))))
        .catch(err => console.error(err));
}

function editBoardDialog() {

}

async function editBoard() {

}

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

function megjelenit(data, title) {
    let container = document.querySelector("#lists>.row");
    document.querySelector("#lists").style.display = "block";

    let h1 = document.createElement("h1");
    h1.classList.add("text-center", "text-dark");
    h1.innerHTML = title;
    container.appendChild(h1);
    let listIndex = 0;
    data.forEach(list => {
        let col = document.createElement("div");
        col.classList.add("col");
        let div = document.createElement("div");
        let h2 = document.createElement("h2");
        h2.innerHTML = list.name;
        div.appendChild(h2);
        h2.style.backgroundColor = "grey"
        div.classList.add("list");
        div.id = listIndex;
        col.appendChild(div);
        container.appendChild(col);
        fetch(`https://api.trello.com/1/lists/` + list.id + `/cards?key=${loggeduser.key}&token=${loggeduser.token}`).then(response => response.json()).then(data => cards(data, col));
        listIndex += 1;
    });
}

function cards(data, list) {
    data.forEach(card => {
        console.log(card);
        let div = document.createElement("div");
        div.classList.add("card");
        let text = document.createElement("h5");
        text.innerHTML = card.name;
        text.style.margin = "10px";
        div.appendChild(text);
        list.appendChild(div);
    });
}