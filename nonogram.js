var spaces = [];

for(x = 1; x <= 10; x++) {
    var row = [];
    for(y = 1; y <= 10; y++) {
        row.push(Math.floor(Math.random() * Math.floor(2)));
    }
    spaces.push(row);
}

console.log(spaces);