var sharp = require('sharp');
var fs = require('fs');
const sortBy = require('sort-array');

// Import AWS SDK for S3 uploads
var AWS = require('aws-sdk');
// Set AWS credentials from environment vars
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
})

var mediaController = function(Media){

  // Build filenames
  var buildFilename = function(rawFilename){
    // Helper function for date padding
    function pad(n){return n<10 ? '0'+n : n}
    let now = new Date();
    return  pad(now.getHours().toString()) +
            pad(now.getMinutes().toString()) +
            pad(now.getSeconds()) + "_" +
            pad(now.getDate()) +
            pad(now.getMonth()+1) +
            pad(now.getFullYear()) + "_" +
            rawFilename;
  }

  // Make a 150x150px preview copy of each image in a subfolder
  var buildPreview = function(filename, originalImagePath, cb){
    let previewPath = `./public/uploads/previews/${filename}`;
    sharp(originalImagePath).resize(150, 150).toFile(previewPath, function(err, info){
      if(err){return cb(err, null);
      } else {
        cb(null, previewPath);
      }
    });
  }

  // Recieve file uploads, saving them on the server and making a database record
  var post = function(req, res, next){

    console.log(req.file)

    // If there are no files, pass an error
    if (!req.file) return next(new Error("No files were attached."));
    // Get the file
    let upload = req.file;
    // Only allow specified filetypes
    var match = ['image/jpg','image/gif','image/jpeg','image/png'].includes(upload.mimetype);
    if (!match) return next(new Error("That file type is not supported."));

    // Build a filename for the upload, based on the date
    let filename = buildFilename(upload.originalname);

    // Create an S3 object to handle uploads
    var conferooBucket = new AWS.S3({params: {Bucket: 'conferoo'}});

    // Initialise file upload
    conferooBucket.upload({
      ACL: 'public-read',
      Body: fs.createReadStream(upload.path),
      Key: filename,
      ContentType: 'application/octet-stream'
    },
    function (err, data) {
      if (err) return next(err);
      res.status(200).json({"Message": `File successfully uploaded to ${data.Location}`}).end();
    })



  }

  var get = function(req, res, next){
    Media.find().sort({uploadedAt: -1}).exec( function(err, events, next){
      if(err){return next(err)};
      // Send the results
      res.status(200).json(events);
    })
  }

  var deleteSingle = function(req, res, next){
    Media.findById(req.params.id, function(err, media){
      if(err){return next(err)};
      // Get paths to delete files
      var fullPath = "./public/uploads/" + media.sources.full.split("uploads/").pop();
      var previewPath = "./public/uploads/previews/" + media.sources.full.split("uploads/").pop();
      // Now delete DB record
      media.remove(function(err){
        if(err){return next(err)} else {
        // And delete the files too
        fs.unlink(fullPath, function(err){
          if(err){return next(err)}
          fs.unlink(previewPath, function(err){
            if(err){return next(err)}
            // Thanks user, we're done here
            res.status(200).json({message: "Media deleted successfully."});
          })
        })
        }
      })
    })
  }

  // Expose public methods
  return {
    get: get,
    post: post,
    delete: deleteSingle
  }
}

module.exports = mediaController;
