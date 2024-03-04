


let coords = [{coords: "38.92137219444016, -95.32975270145953" }, {coords: "38.92137219444016, -95.32975270145953"}, {coords: "38.92137219444016, -95.32975270145953" }];


let firstCoord = coords[0].coords;


console.log(firstCoord)


var commaPos = firstCoord.indexOf(',');

console.log(commaPos);

console.log(parseFloat(firstCoord.substring(0,commaPos)))

console.log(parseFloat(firstCoord.substring(commaPos + 1,firstCoord.length)))