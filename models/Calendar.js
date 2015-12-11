var mongoose = require('mongoose');

var CalSchema = new mongoose.Schema({
    blocks:[{professor: String,
    classId: String,
    room: String,
    time: String,
    days: String}]
});

mongoose.model('Calendar', CalSchema);