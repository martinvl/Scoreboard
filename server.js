var express = require('express');
var http = require('http');
var socket_io = require('socket.io');
var Watch = require('fs-watcher').watch;
var ObjSync = require('ObjSync');

var PORT = 80;

// setup http server
var app = express();
app.use(express.static(__dirname + '/desktop'));

var server = http.createServer(app);
server.listen(PORT);

// setup syncing
var sockets = socket_io.listen(server).set('log level', 0).sockets;
var tasksSyncer = new ObjSync(sockets, {delimiter:'/', publish:true, subscribe:false});

// monitor filesystem
var watcher = new Watch({root:'tasks/', refresh:100});

watcher.on('watching', function (event) {
    if (event.dir) {
        if (event.path != './') {
            tasksSyncer.setObjectForKeypath({dummy:false}, event.path);
        }
    } else {
        tasksSyncer.setValueForKeypath(true, event.path);
    }
});

watcher.start();
