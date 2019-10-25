module.exports = (config: any) => {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma')
    ],
    client: {
      clearContext: false
    },
    preprocessors: {
      '**/app/*.ts': ['coverage']
    },
    coverageInstanbulReporter: {
      includeAllSources: true,
      reports: ['html', 'lcovonly'],
      fixWebpackSourcePaths: true,
      thresholds: {
        emitWarning: false, // set to `true` to not fail the test command when thresholds are not met
        // thresholds for all files
        global: {
          statements: 80,
          lines: 80,
          branches: 80,
          functions: 80
        },
        // thresholds per file
        each: {
          statements: 80,
          lines: 80,
          branches: 80,
          functions: 80,
          overrides: {
          }
        }
      },
    },
    angularCli: {
      environment: 'dev'
    },
    port: 9009,
    colors: true,
    logLevel: config.logLevel,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false
  });
};
