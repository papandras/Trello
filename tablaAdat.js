const params = new URLSearchParams(window.location.search)
const tableId = params.get("id");
fetch(`https://api.trello.com/1/boards/` + tableId + `/lists?key=${loggeduser.key}&token=${loggeduser.token}`).then(response => response.json()).then(data => megnyitas(data));

function megnyitas(data){
    let container = document.querySelector(".row");
    let listIndex = 0;
    data.forEach(list => {
        let col = document.createElement("div");
        col.classList.add("col");
        let div = document.createElement("div");
        let h2 = document.createElement("h2");
        h2.innerHTML = list["name"];
        div.appendChild(h2);
        h2.style.backgroundColor = "grey"
        div.classList.add("list");
        div.id = listIndex;
        col.appendChild(div);
        container.appendChild(col);
        fetch(`https://api.trello.com/1/lists/` + list["id"] + `/cards?key=${loggeduser.key}&token=${loggeduser.token}`).then(response => response.json()).then(data => cards(data, col));
        listIndex += 1;
    });
}

function cards(data, list){
    data.forEach(card => {
        console.log(card);
        let div = document.createElement("div");
        div.classList.add("card");
        let text = document.createElement("h5");
        text.innerHTML = card["name"];
        div.appendChild(text);
        list.appendChild(div);
    });
}