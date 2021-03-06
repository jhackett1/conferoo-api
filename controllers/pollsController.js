const sortBy = require('sort-array');

var pollsController = function(Poll){

  var respond = function(req, res, next){
    Poll.findById(req.params.id, function(err, poll){
      if(err){return next(err)};
      let updatedPoll = poll;
      // Are we dealing with an open or multiple choice poll
      if (poll.type === 'open') {
        // For open
        if (req.body.response) {
          if (req.body.response) {
            updatedPoll.openResponses.push(req.body.response);
          }
        }
      } else {
        // For multiple choice
        if(updatedPoll.responses[req.body.response.option]){

          console.log("Responses object: ", typeof(updatedPoll.responses.a))
          // console.log("2: ", req.body.response.option)

          updatedPoll.responses[req.body.response.option].push(req.body.response.email);
        }
      }
      poll.markModified('responses');
      //Save the document
      poll.save(function(err, updatedPoll){
        if(err){return next(err)};
        res.status(201).send(poll);
      });
    })
  }


  var post = function(req, res, next){
    var newPoll = new Poll(req.body);
    newPoll.save(function(err, newPoll){
      if(err){return next(err)};
      res.status(201).send(newPoll);
    });
  }

  var getList = function(req, res){
    // Blank query
    var query = {};
    // Make the list queryable by day, time and poll
    // Make DB query
    Poll.find(query).sort({createdAt: -1}).lean().exec( function(err, polls, next){
      if(err){return next(err)};
      // Send the results
      res.status(200).json(polls);
    })
  }

  var getSingle = function(req, res, next){
    Poll.findById(req.params.id).lean().exec(function(err, poll){
      if(err){return next(err)};
      res.json(poll);
    })
  }

  var deleteSingle = function(req, res, next){
    Poll.findById(req.params.id).remove(function(err){
      if(err){return next(err)} else {
      res.status(200).json({message: "That poll has been successfully deleted"});
      }
    })
  }

  var patchSingle = function(req, res, next){
    Poll.findById(req.params.id, function(err, poll){
      if(err){return next(err)};
      // Pull in any body keys that are present, and update the document
      for(var p in req.body){
        poll[p] = req.body[p];
      }
      //Save the document
      poll.save(function(err, updatedPoll){
        if(err){return next(err)};
        res.status(201).send(updatedPoll);
      });
    })
  }

  // Expose public methods
  return {
    respond: respond,
    post: post,
    getList: getList,
    getSingle: getSingle,
    deleteSingle: deleteSingle,
    patchSingle: patchSingle
  }

}

module.exports = pollsController;
