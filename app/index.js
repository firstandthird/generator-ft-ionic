'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var fs = require('extfs');

var FtIonicGenerator = yeoman.generators.Base.extend({
  _processDir : function (source, destination) {
    var root = this.isPathAbsolute(source) ? source : path.join(this.sourceRoot(), source);
    var files = this.expandFiles('**', { dot: true, cwd: root });
    var dest;

    for (var i = 0; i < files.length; i++) {
      var f = files[i];
      var src = path.join(root, f);

      if(!path.basename(f).indexOf('_')){
        dest = path.join(destination, path.dirname(f), path.basename(f).replace(/^_/, ''));
        this.template(src, dest);
      }
      else{
        dest = path.join(destination, f);
        this.copy(src, dest);
      }
    }
  },

  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the First + Third Ionic Cordova generator!'
    ));

    var prompts = [
      {
        name: 'name',
        message: 'What should be the name of the application?'
      },
      {
        name: 'identifier',
        message: 'What should be the identifier of the application?',
        default: function (params) {
          return 'com.firstandthird.' + params.name.toLowerCase();
        }
      },
      {
        type: 'checkbox',
        name: 'platforms',
        message: 'Available platforms',
        choices: ['iOS', 'Android'],
        default: ['iOS']
      },
      {
        type: 'checkbox',
        name: 'plugins',
        message: 'Do you want to add some plugins?',
        choices: [
          {
            name: 'Console',
            value: 'org.apache.cordova.console',
            checked: true
          },
          {
            name: 'Keyboard',
            value: 'com.ionic.keyboard',
            checked: true
          },
          {
            name: 'Statusbar',
            value: 'org.apache.cordova.statusbar',
            checked: true
          },
          {
            name: 'Camera',
            value: 'org.apache.cordova.camera'
          },
          {
            name: 'Device',
            value: 'org.apache.cordova.device'
          },
          {
            name: 'File Transfer',
            value: 'org.apache.cordova.file-transfer'
          },
          {
            name: 'Geolocation',
            value: 'org.apache.cordova.geolocation'
          },
          {
            name: 'File Transfer',
            value: 'org.apache.cordova.file-transfer'
          }
        ]
      }
    ];

    this.prompt(prompts, function (props) {
      this.name = props.name;
      this.identifier = props.identifier;
      this.platforms = props.platforms.map(function (platform) {
        return platform.toLowerCase();
      });
      this.plugins = props.plugins;

      done();
    }.bind(this));
  },

  createCordova: function () {
    var path = fs.isEmptySync('./') ? './' : this.name.toLowerCase();
    var self = this;
    var done = this.async();

    this.spawnCommand('cordova', ['create', path, this.identifier, this.name]).on('exit', function (status) {
      if (status !== 0) {
        self.log('Something went wrong');
      }
      else {
        done();
      }
    });
  },

  addPlatforms: function () {
    var self = this;
    var done = self.async();
    var error = false;
    var completed = 0;

    var onExit = function (status) {
      if (status !== 0) {
        error = true;
        self.log('Something went wrong');
      }
      completed++;

      if (completed === self.platforms.length && !error) {
        done();
      }
    };

    for (var i = 0, len = self.platforms.length; i < len; i++) {
      self.spawnCommand('cordova', ['platform', 'add', self.platforms[i]]).on('exit', onExit);
    }
  },

  addPlugins: function () {
    var self = this;
    var done = self.async();
    var error = false;
    var completed = 0;

    var onExit = function (status) {
      if (status !== 0) {
        error = true;
        self.log('Something went wrong installing plugins, you will have to check this later!');
      }
      completed++;

      if (completed === self.plugins.length) {
        done();
      }
    };

    for (var i = 0, len = self.plugins.length; i < len; i++) {
      self.spawnCommand('cordova', ['plugin', 'add', self.plugins[i]]).on('exit', onExit);
    }
  },
  writing: {
    app: function () {
      fs.removeSync('./www/index.html');
      this.template('_bower.json', 'bower.json', this);
      this.template('_package.json', 'package.json', this);
      this.template('www/_index.html', 'www/index.html');
      this.src.copy('Gruntfile.js', 'Gruntfile.js');

      this.dest.mkdir('platform-merge');
    },

    scripts: function () {
      this.dest.mkdir('scripts');
      this.template('scripts/archive', 'scripts/archive', this);
      this.src.copy('scripts/build', 'scripts/build');
      this.src.copy('scripts/emulate', 'scripts/emulate');
    },

    uiStructure: function () {
      this._processDir('ui', 'ui');
      this.dest.mkdir('ui/js/constants');
      this.dest.mkdir('ui/js/directives');
      this.dest.mkdir('ui/js/services');
    },

    grunt: function () {
      this.dest.mkdir('grunt');
      this.directory('grunt', 'grunt');
    },

    projectfiles: function () {
      this.src.copy('gitignore', '.gitignore');
      this.src.copy('platformsgitignore', 'platforms/.gitignore');
      this.src.copy('jshintrc', '.jshintrc');
      this.directory('hooks', 'hooks');
    },

    remove: function () {
      fs.removeSync('./config.xml');
      fs.removeSync('./www/js/index.js');
      fs.removeSync('./www/css/index.css');
    },

    config: function () {
      this.template('_config.xml', 'config.xml', this);
    }
  },

  end: function () {
    this.installDependencies();
  }
});

module.exports = FtIonicGenerator;
