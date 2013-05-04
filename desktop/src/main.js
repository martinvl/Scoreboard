var $ = require('jquery-browserify');
var io = require('socket.io-client');
var ObjSync = require('ObjSync');
var Scoreboard = require('./Scoreboard');

var scoreboard;
var syncer;
var socket;

$(document).ready(function () {
    scoreboard = new Scoreboard();
    $(document.body).append(scoreboard.div);

    socket = io.connect('');
    syncer = new ObjSync(socket, {delimiter:'/'});

    syncer.on('update', function () {
        console.dir('update');
        scoreboard.setData(syncer.getObject());
    });
});
