var XmlReportHelper = require("../Library/xmlReportHelper.js");
var xmlReportHelper = new XmlReportHelper();

exports.config = {
  directConnect: true,

  // Framework to use. Jasmine is recommended.
  framework: 'jasmine2',
  allScriptsTimeout: 40000,

  //specs: ['./specs/loginSpecs.js'],

  //To use async await 
  SELENIUM_PROMISE_MANAGER: false,

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'shardTestFiles': true,
    'maxInstances': 1,
  },
  // multiCapabilities: [
  //   {
  //     'browserName': 'chrome',
  //     maxInstances: 1,
  //     maxSessions: 1,
  //     count: 1,    
  //     shardTestFiles: false,
  //     sequential: true,
  //     specs: [
  //       '../specs/password.js',
  //       //'../Test/AreaTestSpec.js'
  //     ],
  //   }, {
  //     'browserName': 'chrome',
  //     maxInstances: 1,
  //     maxSessions: 1,
  //     count: 1,    
  //     shardTestFiles: false,
  //     sequential: true,
  //     specs: [
  //       '../specs/loginSpecs.js',
  //       //'../Test/BalanceMaintenanceTestSpec.js',
  //       //'../Test/CardLimitTestSpec.js'
  //     ],
  //   }],

  // verboseMultiSessions: true, 
  // // Options to be passed to Jasmine.
  jasmineNodeOpts: {
    onComplete: null,
    includeStackTrace: true,    // If true, include stack traces in failures.
    isVerbose: true,            // If true, display spec names.
    showColors: true,           // Use colors in the command line report.  
    defaultTimeoutInterval: 240000   // Default time to wait in ms before a test fails.
  },

  onPrepare: () => {
    xmlReportHelper.setupDefaultReporters();
    let globals = require('protractor');
    let browser = globals.browser;
    browser.manage().window().maximize();
    const jasmineReporters = require('jasmine-reporters');
    jasmine.getEnv().addReporter(new jasmineReporters.TerminalReporter({
      verbosity: 3,
      color: true,
      showStack: true
    }));
  },

  beforeAll: function () {

  },

  afterAll: function () {
    // Clearing browser data after each test
    browser.manage().deleteAllCookies();
    browser.executeScript('window.sessionStorage.clear(); window.localStorage.clear();')
  },
  afterLaunch: function () {
    return xmlReportHelper.mergeJUnitReports();
  },
};
