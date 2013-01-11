var Task = require('./Task');

function Scoreboard() {
    this.tasks = new Object();

    this.div = document.createElement('div');
    this.div.className = 'scoreboard';
}

module.exports = Scoreboard;

Scoreboard.prototype.setData = function (data) {
    for (var taskName in data) {
        var taskData = data[taskName];

        // create task if it doesn't exist
        if (!this.tasks[taskName]) {
            this.addTask(taskName);
        }

        // refresh task content
        task = this.tasks[taskName];
        try {
            task.setData(taskData);
        } catch(err) {
            console.info('Corrupt data set. ' + err);
        }
    }
}

Scoreboard.prototype.addTask = function(taskName) {
    var task = new Task(taskName);
    this.tasks[taskName] = task;

    this.div.appendChild(task.div);
}
