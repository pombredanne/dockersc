var shellQuote = require("shell-quote");
var dockerFileParser = require("docker-file-parser");

function parseDockerFile(dockerFileData) {
    return dockerFileParser.parse(dockerFileData, {});
}

function extractFrom(parsedDockerFile) {
    return parsedDockerFile.filter(function(command) {
        return command.name === "FROM";
    })[0].args;
}

function extractRuns(parsedDockerFile) {
    return parsedDockerFile.filter(function(command) {
        return command.name === "RUN";
    }).map(function(command) {
        var args = command.args;
        if (/^\s*\[.*\]\s*$/.test(args)) {
            // FIXME: What to do with non-string items, like ["hello", 1, null]?
            return JSON.parse(args);
        }
        return shellQuote.parse(args);
    });
}

module.exports = function(dockerFileData) {
    var parsed = parseDockerFile(dockerFileData);
    return {
        "from": extractFrom(parsed),
        "runs": extractRuns(parsed)
    };
};
