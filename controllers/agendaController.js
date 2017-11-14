var jwt = require('jwt-simple');


var agendaController = function(User, Event){

  var list = function(req, res, next){
    // Decode a user ID from the supplied token
    var token = req.headers.authorization.split(' ')[1];
    var payload = jwt.decode(token, process.env.JWT_SECRET, function(err){
      if(err) return next(err);
    });
    var userId = payload.sub;
    // Search for and return the user with the specified ID
    User.findById(userId, function(err, user){
      if(err){return next(err)};
      Event.find({_id: user.agenda})
        // Sort by programme first, then by time, then themes
        .sort({programme: 1, time: 1, themes: 1})
        .exec(function (err, events) {
          if(err){return next(err)};
          res.status(200).send(events)
        });
    })
  }

  var add = function(req, res, next){
    // Decode a user ID from the supplied token
    var token = req.headers.authorization.split(' ')[1];
    var payload = jwt.decode(token, process.env.JWT_SECRET, function(err){
      if(err) return next(err);
    });
    var userId = payload.sub;
    // Search for and return the user with the specified ID
    User.findById(userId, function(err, user){
      if(err){return next(err)};
      // Push the ID of the event into the user's agenda
      user.agenda.push(req.body.event);
      // And save it
      user.save(function(err, updatedUser){
        if(err){return next(err)};
        res.status(201).send(updatedUser);
      });
    })
  }

  var remove = function(req, res, next){
    // Decode a user ID from the supplied token
    var token = req.headers.authorization.split(' ')[1];
    var payload = jwt.decode(token, process.env.JWT_SECRET, function(err){
      if(err) return next(err);
    });
    var userId = payload.sub;
    // Search for and return the user with the specified ID
    User.findById(userId, function(err, user){
      if(err){return next(err)};
      // Push the ID of the event into the user's agenda
      user.agenda.splice(req.body.event, 1);
      // And save it
      user.save(function(err, updatedUser){
        if(err){return next(err)};
        res.status(200).send(updatedUser);
      });
    })
  }

  // Expose public methods
  return {
    list: list,
    add: add,
    remove: remove
  }
}

module.exports = agendaController;
