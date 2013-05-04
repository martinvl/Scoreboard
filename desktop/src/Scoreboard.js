var Exercise = require('./Exercise');

function Scoreboard() {
    this.exercises = {};

    this.div = document.createElement('div');
    this.div.className = 'scoreboard';
}

module.exports = Scoreboard;

Scoreboard.prototype.setData = function (data) {
    for (var exerciseID in data) {
        var exerciseData = data[exerciseID];
        var exerciseName = exerciseData.displayName;

        // create exercise if it doesn't exist
        if (!this.exercises.hasOwnProperty(exerciseID)) {
            this.addExercise(exerciseID, exerciseName);
        }

        // refresh exercise content
        exercise = this.exercises[exerciseID];

        try {
            exercise.setData(exerciseData);
        } catch(err) {
            console.info('Corrupt data set. ' + err);
        }
    }
}

Scoreboard.prototype.addExercise = function(exerciseID, displayName) {
    var exercise = new Exercise(displayName);
    this.exercises[exerciseID] = exercise;

    this.div.appendChild(exercise.div);
}
