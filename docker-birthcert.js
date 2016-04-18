#!/usr/bin/env node

var fs = require('fs')
var parse = require('dockerfile-parse')
var util = require('util')
var validateDockerfile = require('validate-dockerfile')

var SHELLMETA = '[<>&|;()`#]'
var PKGCHARS = '[a-z+-=0-9\. \t~\*]'
var APT_RE = new RegExp(
    '^.*apt-get +(?:-.+?[ \t]+)*install +(?:-.+?[ \t]+)*(' + PKGCHARS + '+)' + 
    SHELLMETA + '?.*$')

var args = process.argv.slice(2);
if(!args.length) {
    console.error(util.format("Usage: %s <dockerfile>", process.argv[1]))
    process.exit(1)
}

var dockerFile = fs.readFileSync(args[0], 'utf8')
var isValid = validateDockerfile(dockerFile)

if(!isValid.valid) {
    console.error("Dockerfile not valid:")
    for (var msg in isValid.errors)
	console.error(isValid.errors[msg].message)
    process.exit(1)
}
var pojo = parse(dockerFile)

var out = {'baseimage': pojo.from}
out['bom-depends'] = []

for(var cmd in pojo.run) {
    if(pojo.run[cmd].search(APT_RE))
	continue
    var pkgs = pojo.run[cmd].replace(APT_RE, "\$1").trim().split(/\s+/)
    pkgs.forEach(function(pkg) {
	out['bom-depends'].push(pkg.split(/=/)[0])
    })
}

console.log(JSON.stringify(out))
