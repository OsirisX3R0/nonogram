var spaces = [];
var nono = document.getElementById("nono");
var board = document.createElement("table");

for(x = 1; x <= 10; x++) {
    //var row = [];
    var row = document.createElement("tr");

    for(y = 1; y <= 10; y++) {
        var space = document.createElement("td");
        var check = document.createElement("input");
        check.type = "checkbox";
        
        check.checked = Math.floor(Math.random() * Math.floor(2)) == 1 ? true : false;
        space.appendChild(check);
        row.appendChild(space);
    }
    //spaces.push(row);
    board.appendChild(row);
}
nono.appendChild(board);