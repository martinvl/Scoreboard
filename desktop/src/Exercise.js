function Exercise(displayName) {
    this.displayName = displayName;

    this.setup();
}

module.exports = Exercise;

Exercise.prototype.setup = function() {
    // create div element
    this.div = document.createElement('div');
    this.div.className = 'exercise';

    // create header
    this.header = document.createElement('h1');
    this.header.innerHTML = this.displayName;
    this.div.appendChild(this.header);

    // create name list
    this.list = document.createElement('ul');
    this.div.appendChild(this.list);
}

Exercise.prototype.setData = function(data) {
    this.emptyList();

    for (var idx in data.names) {
        var name = data.names[idx];
        var element = document.createElement('li');
        element.innerHTML = name;

        this.list.appendChild(element);
    }
}

Exercise.prototype.emptyList = function() {
    while (this.list.childNodes.length > 0) {
        this.list.removeChild(this.list.firstChild);
    }
}
