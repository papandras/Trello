async function getBoards() {
    let response = await fetch("https://api.trello.com/1/members/me/boards?key=ab68071cce6d5327c51aff6ee120a7ed&token=3a03937377c536ac504197988cc3ed254084472039551a846481227f62e71b59");
    let data = await response.json();

    let template = document.getElementsByTagName("template")[0].content;
    for (let tabla of Object.values(data)) {
        console.log(tabla.name);
        card = document.importNode(template, true);
        card.querySelector("h5").innerText = tabla.name;
        document.getElementById("main-container").appendChild(card);
    }
}

getBoards();

function addKeyToken(){
    //
}