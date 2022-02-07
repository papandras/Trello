async function getBoards() {
    let response = await fetch("https://api.trello.com/1/members/me/boards?key="+loggeduser.key+"&token="+loggeduser.token);
    let data = await response.json();

    let template = document.getElementsByTagName("template")[0].content;
    for (let tabla of Object.values(data)) {
        console.log(tabla);
        card = document.importNode(template, true);
        card.getElementById("megnyitas").id = tabla.id;
        card.querySelector("h5").innerText = tabla.name;
        card.querySelector("p").innerText += tabla.dateLastActivity.slice(0,10);
        document.getElementById("main-container").appendChild(card);
    }
    for(let i = 0; i < document.getElementsByClassName("megnyitas").length; ++i){
        document.getElementsByClassName("megnyitas")[i].setAttribute("href", "tablaAdat.html?id="+document.getElementsByClassName("megnyitas")[i].id);
    }
}

getBoards();

if (loggeduser.key == null && loggeduser.token == null) {
    document.getElementById("main-container").style.display = "block";
    document.getElementsByClassName("alert-success")[0].style.display = "block";
}

async function deleteBoards(id) {
    let response = await fetch("https://api.trello.com/1/boards/{id}");
    let data = await response.json();

    //let div = document.getElementsByName("template").getElementByName("div").getElementById(id).content;
    response.content = null;
    document.getElementsByName("template").getElementByName("div").getElementById(id).content = null;

    getBoards();
}