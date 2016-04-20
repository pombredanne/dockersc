module.exports = function(dockerFile){
    var validateDockerfile = require('validate-dockerfile')
    var extract = require('./extract')

    var isValid = validateDockerfile(dockerFile)
    if(!isValid.valid)
	return [isValid, {}]

    var parsed = extract(dockerFile)

    var out = {'baseimage': parsed.from}
    out['bom-depends'] = []

    function sliceRuns(runs) {
	var objects = []
	runs.forEach(function(cmds) {
	    var indexes = []
	    
	    cmds.forEach(function(cmd, index) {
		if(typeof cmd === "object") 
		    if(cmd.op != 'glob')
			indexes.push(index)
	    })
	    var previous = 0
	    indexes.push(cmds.length)
	    indexes.forEach(function(index) {
		objects.push(cmds.slice(previous, index))
		previous = index + 1
	    })

	})
	return objects
    }
    
    function removeOpts(cmd) {
	cleaned = []
	cmd.forEach(function(op) {
	    if(typeof op === "object")
		op = op.pattern.split(/=/)[0]
	    if(op[0] != "-")
		cleaned.push(op)
	})
	return cleaned
    }

    sliceRuns(parsed.runs).forEach(function(cmd) {
	if(cmd[0] != 'apt-get')
	    return
	cmd = removeOpts(cmd.slice(1, cmd.length))
	if(cmd[0] != 'install')
	    return
	out['bom-depends'].push.apply(out['bom-depends'], 
				      cmd.slice(1, cmd.length))
    })
    
    return [isValid, out]
}
