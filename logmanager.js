LogManager = {};

LogManager.createLogger = function(options) {
   options = options || {};
   var metadata = {
      app_name: 'PlayaInfo'
   };

   var winston = Meteor.npmRequire('winston');
   // Npm.require('winston-logstash');
   // Npm.require('winston-logstash-file');

   var logger = new(winston.Logger)({
      transports: [
         new(winston.transports.Console)({
            level: options.defaultLevel || 'info'
         }),
         new(winston.transports.File)({
            level: options.defaultLevel || 'info',
            filename: options.logFile || 'application.log',
            json: options.logJson || true,
            logstash: options.logStashFormat || false,
            maxsize: options.maxSize || 20480,
            maxFiles: options.maxFiles || 10
         }),
         // new(winston.transports.LogstashFile)({
         //    filename: options.logFile || 'application.log',
         //    json: options.logJson || true,
         //    level: options.defaultLevel || 'info'
         // }),
         // ,new(winston.transports.Logstash)({
         //    level: 'info',
         //    port: 28777,
         //    node_name: 'logstash.midburn.org',
         //    host: Npm.require('os').hostname()
         // })
      ]
   });

   var log = {
      options: {
         metadata: metadata
      }
   };

   var addMetadata = function(args, f) {
      var argsLength = args.length;

      if (typeof args[argsLength - 1] !== 'object') {
         args.push(metadata);
      } else {
         _.extend(args[argsLength - 1], metadata);
      }
      f.apply(null, args);
   };

   log.silly = function() {
      var args = [].slice.apply(arguments);
      addMetadata(args, logger.silly);
   };

   log.verbose = function() {
      var args = [].slice.apply(arguments);
      addMetadata(args, logger.verbose);
   };

   log.info = function() {
      var args = [].slice.apply(arguments);
      addMetadata(args, logger.info);
   };

   log.warn = function() {
      var args = [].slice.apply(arguments);
      addMetadata(args, logger.warn);
   };

   log.error = function() {
      var args = [].slice.apply(arguments);
      addMetadata(args, logger.error);
   };

   return log;
};