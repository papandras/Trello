if(JSON.parse(localStorage.getItem("auth")) == false){
    document.location.assign("login.html");
}

function kijelentkezes(){
    localStorage.setItem("auth", false);
    document.location.assign("login.html");
}

fetch('https://api.trello.com/1/actions/ab68071cce6d5327c51aff6ee120a7ed?text=3a03937377c536ac504197988cc3ed254084472039551a846481227f62e71b59').then(r => r.json());