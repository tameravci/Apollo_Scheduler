var mongoose = require('mongoose');

var ProfessorSchema = new mongoose.Schema({
	name: String
});

mongoose.model('Professor', ProfessorSchema);