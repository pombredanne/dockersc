var dockersc = require("../");
var tape = require("tape");
var fs = require("fs");

tape("an invalid Dockerfile", function (t) {

    var dockerFile = fs.readFileSync(__dirname + "/Dockerfile.invalid", "utf8");
    var sc = dockersc(dockerFile);
    var wanted = [ { errors: [ { message: "Missing CMD", priority: 1 } ],
                     valid: false },
                   {} ];

    t.deepEqual(sc, wanted);

    t.end();

});

tape("a simplistic Dockerfile (apt-get)", function (t) {

    var dockerFile = fs.readFileSync(__dirname +
      "/Dockerfile.apt-get-simple", "utf8");
    var sc = dockersc(dockerFile);
    var wanted = [ { valid: true },
                   { baseimage: "ubuntu:14.04",
                     "bom-depends": [ "smbclient" ] } ];

    t.deepEqual(sc, wanted);

    t.end();

});

tape("a valid Dockerfile (apt-get) with line escapes", function (t) {

    var dockerFile = fs.readFileSync(__dirname +
      "/Dockerfile.apt-get-multiline", "utf8");
    var sc = dockersc(dockerFile);
    var wanted = [ { valid: true },
                   { baseimage: "ubuntu:14.04", "bom-depends":
                     [ "aufs-tools", "automake", "build-essential", "curl",
                       "dpkg-sig", "libcap-dev", "libsqlite3-dev", "mercurial",
                       "reprepro", "ruby1.9.1", "ruby1.9.1-dev", "s3cmd" ] } ];

    t.deepEqual(sc, wanted);

    t.end();

});

tape("a valid Dockerfile (yum)", function (t) {

    var dockerFile = fs.readFileSync(__dirname + "/Dockerfile.yum", "utf8");
    var sc = dockersc(dockerFile);
    var wanted = [ { valid: true },
                   { baseimage: "centos:centos6", "bom-depends":
                   [ "gcc", "gcc-c++", "rpmdevtools", "tar", "yum-utils" ] } ];

    t.deepEqual(sc, wanted);

    t.end();

});

tape("a valid Dockerfile (dnf)", function (t) {

    var dockerFile = fs.readFileSync(__dirname + "/Dockerfile.dnf", "utf8");
    var sc = dockersc(dockerFile);
    var wanted = [ { valid: true },
                   { baseimage: "fedora:22", "bom-depends":
                   [ "tar", "gcc-c++", "rubygem-nokogiri",
                     "rubygem-asciidoctor", "asciidoc", "fop", "docbook-xsl",
                     "ditaa", "java-1.8.0-openjdk-devel", "ruby-devel",
                     "zlib-devel", "google-noto-serif-fonts", "wget",
                     "python-devel" ] } ];

    t.deepEqual(sc, wanted);

    t.end();

});

tape("a valid Dockerfile (apk)", function (t) {

    var dockerFile = fs.readFileSync(__dirname + "/Dockerfile.apk", "utf8");
    var sc = dockersc(dockerFile);
    var wanted = [ { valid: true },
                   { baseimage: "alpine:3.3", "bom-depends":
                   [ "su-exec", ".build-deps", "gcc", "linux-headers", "make", 
                     "musl-dev", "tar" ] } ];

    t.deepEqual(sc, wanted);

    t.end();

});
