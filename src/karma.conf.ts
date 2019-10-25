module.exports = function(config: any) {
  config.set({
    frameworks: ['jasmine', 'karma-typescript'],
    preprocessors: {
      '**/*.ts': 'karma-typescript'
    },
    reporters: ['progress', 'karma-typescript'],
    browsers: ['Chrome'],
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    singleRun: false
  });
};
