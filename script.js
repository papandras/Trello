if(JSON.parse(localStorage.getItem("auth")) == null){
    localStorage.setItem("auth", false);
}

if(JSON.parse(localStorage.getItem("auth")) == false){
    document.location.assign("login.html");
}

function kijelentkezes(){
    localStorage.setItem("auth", false);
    document.location.assign("login.html");
}

let lists, certainListId;
let getvalami = fetch(`https://api.trello.com/1/members/me/boards?key=ab68071cce6d5327c51aff6ee120a7ed&token=3a03937377c536ac504197988cc3ed254084472039551a846481227f62e71b59`)
.then(response => response.json())
.then(response => {
    lists = response.body;
    certainListId = lists.find(list => list.name === "listName").id;
    console.log("id: " + certainListId);

}).catch(err => console.error(err));

let getmegvalami = fetch(`https://api.trello.com/1/lists/${certainListId}/cards`)
.then(response => response.json())
.then(response => {
        let certainListCards = response.body;
        let firstCard = certainListCards[0];
    }).catch(err => console.error(err));

Promise.all([getvalami, getmegvalami]);