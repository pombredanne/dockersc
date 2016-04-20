module.exports = function(dockerFile){
    var parse = require('dockerfile-parse')
    var validateDockerfile = require('validate-dockerfile')
    
    var SHELLMETA = '[<>&|;()`#]'
    var PKGCHARS = '[a-z+-=0-9\. \t~\*]'
    var APT_RE = new RegExp(
	'^.*apt-get +(?:-.+?[ \t]+)*install +(?:-.+?[ \t]+)*(' + 
	    PKGCHARS + '+)' + SHELLMETA + '?.*$')

    var isValid = validateDockerfile(dockerFile)
    if(!isValid.valid)
	return [isValid, {}]

    var pojo = parse(dockerFile)

    var out = {'baseimage': pojo.from}
    out['bom-depends'] = []

    pojo.run.forEach(function(cmd) {
	if(cmd.search(APT_RE))
	    return
	var pkgs = cmd.replace(APT_RE, "\$1").trim().split(/\s+/)
	pkgs.forEach(function(pkg) {
	    out['bom-depends'].push(pkg.split(/=/)[0])
	})
    })

    return [isValid, out]
}