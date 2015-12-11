var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Express'
    });
});

var Professor = mongoose.model('Professor');
var Classroom = mongoose.model('Classroom');
var Calendar = mongoose.model('Calendar');

router.get('/getProfessors', function(req, res, next) {
    Professor.find(function(err, prof) {
        if (err) {
            return next(err);
        }
        res.json(prof);
    });
});

router.post('/addProfessor', function(req, res, next) {
    var professor = new Professor(req.body);
    professor.save(function(err, prof) {
        if (err) {
            return next(err);
        }
        res.json(prof);
    });
});

router.post('/removeProfessor', function(req, res, next) {
    Professor.remove(req.body, function(err, prof) {
        if (err) {
            return next(err);
        }
        res.json(prof);
    });

});

router.post('/updateProfessor', function(req, res, next) {
    var query = {
        name: req.body.name
    };
    var change = {
        name: req.body.new
    };
    Professor.update(query, change, function(err, prof) {
        if (err) {
            return next(err);
        }
        res.json(prof);
    });
});


router.get('/getClassrooms', function(req, res, next) {
    Classroom.find(function(err, room) {
        if (err) {
            return next(err);
        }
        res.json(room);
    });
});

router.post('/addClassroom', function(req, res, next) {
    var classroom = new Classroom(req.body);
    classroom.save(function(err, room) {
        if (err) {
            return next(err);
        }
        res.json(room);
    });
});

router.post('/removeClassroom', function(req, res, next) {
    Classroom.remove(req.body, function(err, room) {
        if (err) {
            return next(err);
        }
        res.json(room);
    });

});

router.post('/updateClassroom', function(req, res, next) {
    var query = {
        code: req.body.code
    };
    var change = {
        code: req.body.new
    };
    Classroom.update(query, change, function(err, room) {
        if (err) {
            return next(err);
        }
        res.json(room);
    });
});



router.get('/getCalendar', function(req, res, next) {
    Calendar.find(function(err, block) {
        if (err) {
            return next(err);
        }
        res.json(block);
    });
});

router.post('/refresh', function(req, res, next) {
    console.log(req.body);
    Calendar.remove({}, function(err, block) {
        if (err) {
            return next(err);
        }
        console.log(req.body);
        var calendar = new Calendar(req.body);
        calendar.save(function(err, cal) {
            if (err) {
                return next(err);
            }
            res.json(cal);
        });
    });

});

module.exports = router;