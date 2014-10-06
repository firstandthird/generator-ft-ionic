module.exports = function(grunt) {
  var fs = require('fs');

  var aws = (fs.existsSync('aws.json')) ? require('./aws.json') : {};

  require('load-grunt-config')(grunt, {
    config: {
      ui: 'ui/',
      aws: aws,
      dist: 'www/'
    }
  });
};
