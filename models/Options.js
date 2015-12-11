var mongoose = require('mongoose');

var OptionsSchema = new mongoose.Schema({
	professor: [{name: String}],
	classrooms: [{code: String}]
});

mongoose.model('Option', OptionsSchema);