var util = require("util");
var fs = require("fs");
var dockersc = require("./index.js");

var args = process.argv.slice(2);
if(!args.length) {
    console.error(util.format("Usage: %s <dockerfile>", process.argv[1]));
    process.exit(1);
}

var dockerFile = fs.readFileSync(args[0], "utf8");

var retval = dockersc(dockerFile);
var isValid = retval[0];
var out = retval[1];

if(!isValid.valid) {
    console.error("Dockerfile not valid:");
    isValid.errors.forEach(function(error) {
        console.error(error.message);
    });
    process.exit(1);
}

console.log(JSON.stringify(out, null, 2));
