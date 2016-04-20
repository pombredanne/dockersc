var dockersc = require('../')
var tape = require('tape')
var fs = require('fs')

tape('an invalid Dockerfile', function (t) {

  var dockerFile = fs.readFileSync(__dirname + '/Dockerfile', 'utf8')
  var sc = dockersc(dockerFile)
  var wanted = [ { errors: [ { message: 'Missing CMD', priority: 1 } ], 
		   valid: false }, 
		 {} ]

  t.deepEqual(sc, wanted)

  t.end()
  
})

tape('a valid Dockerfile with line escapes', function (t) {

  var dockerFile = fs.readFileSync(__dirname + '/Dockerfile2', 'utf8')
  var sc = dockersc(dockerFile)
  var wanted = [ { valid: true }, 
		 { baseimage: 'ubuntu:14.04', 'bom-depends': 
		   [ 'aufs-tools', 'automake', 'build-essential', 'curl', 
		     'dpkg-sig', 'libcap-dev', 'libsqlite3-dev', 'mercurial', 
		     'reprepro', 'ruby1.9.1', 'ruby1.9.1-dev', 's3cmd' ] } ]

  t.deepEqual(sc, wanted)

  t.end()
  
})
