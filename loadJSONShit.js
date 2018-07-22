const fs = require('fs')

let test = JSON.parse(fs.readFileSync('starsJSON.json', 'utf8'))

console.log(test)
