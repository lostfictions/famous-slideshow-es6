#!/usr/bin/env node

'use strict';

var browserify = require('browserify');
var watchify = require('watchify');
var bs = require('browser-sync');
var ws = require('fs').createWriteStream;
var to5ify = require('6to5ify');
var famousify = require('famousify');
var lessify = require('node-lessify');

var NwBuilder = require('node-webkit-builder');

var outDir = './public/';
var config = {
  browserify: {
    entryFile: './src/index.js',
    outFile: outDir + 'bundle.js',
    args: {
      // cache, packageCache and fullPaths are required for watchify
      cache: {},
      packageCache: {},
      fullPaths: true,
      debug: true
    }
  },
  browserSync: {
    server: {
      baseDir: outDir
    }
  }
};

var tasks = {
  nwbuild: function() {
    var nw = new NwBuilder({
        version: 'latest',
        files: './nwapp/**',
        // macIcns: './icons/icon.icns',
        // macPlist: {mac_bundle_id: 'myPkg'},
        platforms: ['linux64']
    });

    nw.on('log', function (msg) {
        console.log('[node-webkit-builder] ', msg);
    });

    nw.build().catch(function (err) {
        console.log('[node-webkit-builder] ERROR: ', err);
    });
  },
  watch: function() {
    var b = browserify(config.browserify.args)
      .transform(to5ify.configure({
        experimental: true,
        modules: 'commonInterop'
      }))
      .transform(famousify)
      .transform(lessify)
      .add('6to5/polyfill')
      .require(config.browserify.entryFile, { entry: true });

    var w = watchify(b);

    var rebundle = function() {
      w.bundle()
        .on('error', function(err) {
          var msg = '[browserify] ERROR: ' + err.message;
          if(bs.active) {
            // set a timeout, because the initial 'BrowserSync connected'
            // message helpfully squashes any other notifications on reload
            setTimeout(function() {
              bs.notify(msg, 10000);
            }, 1000);
          }
          console.error(msg);
        })
        .on('end', function() {
          if(bs.active) {
            bs.reload();
          }
        })
        .pipe(ws(config.browserify.outFile));
    };

    w.on('update', rebundle);
    w.on('log', console.log);

    rebundle();
  },
  serve: function() {
    bs(config.browserSync);
    tasks.watch();
  }
};

var task = process.argv.slice(2)[0];
if(!(task in tasks)) {
  console.log(
    'Invalid task! Possible tasks are:\n' +
    Object.keys(tasks).map(function(t) { return ' - ' + t; }).join('\n'));
}
else {
  tasks[task]();
}

