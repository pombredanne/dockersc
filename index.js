module.exports = function(dockerFile){
    var validateDockerfile = require("validate-dockerfile");
    var extract = require("./extract");

    var PACKAGE_MANAGERS = ["apt-get", "yum", "apk", "dnf"];

    var isValid = validateDockerfile(dockerFile);
    if(!isValid.valid) {
        return [isValid, {}];
    }

    var parsed = extract(dockerFile);

    var out = {"baseimage": parsed.from};
    out["bom-depends"] = [];

    function sliceRuns(runs) {
        var objects = [];
        runs.forEach(function(cmds) {
            var indexes = [];

            cmds.forEach(function(cmd, index) {
                if(typeof cmd === "object") {
                    if(cmd.op !== "glob") {
                        indexes.push(index);
                    }
                }
            });
            var previous = 0;
            indexes.push(cmds.length);
            indexes.forEach(function(index) {
                objects.push(cmds.slice(previous, index));
                previous = index + 1;
            });

        });
        return objects;
    }

    function removeOpts(cmd) {
        var cleaned = [];
        cmd.forEach(function(op) {
            if(typeof op === "object") {
                op = op.pattern.split(/=/)[0];
            }
            if(op[0] !== "-") {
                op = op.split(/[<>]=/)[0];
                cleaned.push(op);
            }
        });
        return cleaned;
    }

    sliceRuns(parsed.runs).forEach(function(cmd) {
        var packman = cmd[0];
        if(PACKAGE_MANAGERS.indexOf(packman) === -1) {
            return;
        }
        cmd = removeOpts(cmd.slice(1, cmd.length));
        if(packman === "apk") {
            if(cmd[0] !== "add") {
                return;
            }
        }
        else if(cmd[0] !== "install") {
            return;
        }
        cmd.slice(1, cmd.length).forEach(function(pkg) {
            if(out["bom-depends"].indexOf(pkg) === -1) {
                out["bom-depends"].push(pkg);
            }
        });

    });

    return [isValid, out];
};
