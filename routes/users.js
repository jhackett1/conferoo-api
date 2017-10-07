var express = require('express');
// Import model
var User = require('../models/userModel');

var routes = function(app){

  var router = express.Router();
  var userController = require('../controllers/usersController')(User);

  router.route('/')
    // LIST EXISTING USERS
    // GET a list of all existing users
    .get(userController.list)
    
  return router;
}

module.exports = routes;