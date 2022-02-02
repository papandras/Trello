async function getBoards() {
    let response = await fetch("https://api.trello.com/1/members/me/boards?key="+loggeduser.key+"&token="+loggeduser.token);
    let data = await response.json();

    let template = document.getElementsByTagName("template")[0].content;
    for (let tabla of Object.values(data)) {
        console.log(tabla);
        card = document.importNode(template, true);
        card.querySelector("h5").innerText = tabla.name;
        card.querySelector("p").innerText += tabla.dateLastActivity.slice(0,10);
        document.getElementById("main-container").appendChild(card);
    }
}

getBoards();

if (loggeduser.key == null && loggeduser.token == null) {
    document.getElementById("main-container").style.display = "block";
    document.getElementsByClassName("alert-success")[0].style.display = "block";
}