var TASK_PREFIX = 'Oppgave ';

function Task(name) {
    this.name = name;

    this.setup();
}

module.exports = Task;

Task.prototype.setup = function() {
    // create div element
    this.div = document.createElement('div');
    this.div.className = 'task';

    // create header
    this.header = document.createElement('h1');
    this.header.innerHTML = TASK_PREFIX + this.name;
    this.div.appendChild(this.header);

    // create name list
    this.list = document.createElement('ul');
    this.div.appendChild(this.list);
}

Task.prototype.setData = function(data) {
    this.emptyList();

    for (var name in data) {
        if (data[name]) {
            var element = document.createElement('li');
            element.innerHTML = name;

            this.list.appendChild(element);
        }
    }
}

Task.prototype.emptyList = function() {
    while (this.list.childNodes.length > 0) {
        this.list.removeChild(this.list.firstChild);
    }
}
