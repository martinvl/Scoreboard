#!/usr/bin/env node

var express = require('express');
var http = require('http');
var socket_io = require('socket.io');
var Watch = require('fs-watcher').watch;
var fs = require('fs');
var ObjSync = require('ObjSync');

var PORT = 80;

// setup http server
var app = express();
app.use(express.static(__dirname + '/desktop'));

var server = http.createServer(app);
server.listen(PORT);

// setup syncing
var sockets = socket_io.listen(server).set('log level', 0).sockets;
var nameSyncer = new ObjSync(sockets, {delimiter:'/', publish:true, subscribe:false});

// setup name handling
var names = {
    '1':{displayName:'Oppgave 1', names:[]},
    '2':{displayName:'Oppgave 2', names:[]},
    '3':{displayName:'Oppgave 3', names:[]},
    '4':{displayName:'Oppgave 4', names:[]}
};

var NAMES_BACKUP_PATH = 'data/NAMES';

syncNames();
fetchNames();

function fetchNames() {
    fs.readFile(NAMES_BACKUP_PATH, function (err, data) {
        if (err != undefined) {
            return;
        }

        names = JSON.parse(data);
        syncNames();
    });
}

function backupNames() {
    fs.writeFile(NAMES_BACKUP_PATH, JSON.stringify(names), function (err) {});
}

function syncNames() {
    nameSyncer.setObject(names);
}

function addNameForTask(name, taskID) {
    var nameList = names[taskID].names;

    if (nameList.indexOf(name) != -1)
        return;

    nameList.push(name);
    commitNames();
}

function commitNames() {
    syncNames();
    backupNames();
}

// key-based exercises
var keys = {
    '1':'white rabbit',
    '2':''
};

app.use('/submit', express.bodyParser());
app.post('/submit', function (req, res) {
    var taskID = req.body.task_id;
    var key = req.body.key;
    var name = req.body.name;

    if (key == keys[taskID]) {
        res.redirect('./correct.html');
        addNameForTask(name, taskID);
    } else {
        res.redirect('./wrong.html');
    }
});

// exercise 4
var GRADE_ROOT = 'data';
var GRADE_PATH = 'data/GRADES';
var GRADE_REL = 'GRADES';
var GRADE_BACKUP = 'data/GRADES_BACKUP';

var gradeWatcher = new Watch({root:GRADE_ROOT, refresh:100});

gradeWatcher.on('change', function (event) {
    if (event.path == GRADE_REL) {
        fs.readFile(GRADE_PATH, function (err, data) {
            try {
                var grades = JSON.parse(data);
                var nameList = names['4'].names;
                var change = false;

                for (var name in grades) {
                    if (nameList.indexOf(name) == -1) {
                        nameList.push(name);
                        change = true;
                    }
                }

                if (change) {
                    commitNames();
                    backupGrades(grades);
                }
            } catch(err) {
                revertGrades();
            }
        });
    }
});

gradeWatcher.start();

function backupGrades(grades) {
    fs.writeFile(GRADE_BACKUP, JSON.stringify(grades), function (err) {});
}

function revertGrades() {
    fs.readFile(GRADE_BACKUP, function (err, data) {
        fs.writeFile(GRADE_PATH, data, function (err) {});
    });
}
