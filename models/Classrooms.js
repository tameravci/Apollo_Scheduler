var mongoose = require('mongoose');

var ClassroomSchema = new mongoose.Schema({
	code: String
});

mongoose.model('Classroom', ClassroomSchema);