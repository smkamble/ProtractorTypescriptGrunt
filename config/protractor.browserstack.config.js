var browserstack = require('browserstack-local');
var XmlReportHelper = require("../Library/xmlReportHelper.js");
var xmlReportHelper = new XmlReportHelper();
exports.config = {
  // Framework to use. Jasmine is recommended.
  framework: 'jasmine2',
  allScriptsTimeout: 40000,

  'browserstackUser': "pay8",
  'browserstackKey': "V277RsbLbYuPyGAjLhdq",

  //To use async await 
  SELENIUM_PROMISE_MANAGER: false,

  // Capabilities to be passed to the webdriver instance.
  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'shardTestFiles': true,
    'maxInstances': 1,
  },
  params: {
    language: "welsh",
    imagecompare: true
  },

  noGlobals: false,
  allScriptsTimeout: 20000,
  useAllAngular2AppRoots: true,
  // Options to be passed to Jasmine.
  jasmineNodeOpts: {
    onComplete: null,
    isVerbose: true,
    showColors: true,   // Use colors in the command line report.  
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

  // Code to start browserstack local before start of test
  beforeLaunch: function () {
    console.log("Connecting browserstack local");
    return new Promise(function (resolve, reject) {
      exports.bs_local = new browserstack.Local();
      exports.bs_local.start({ 'key': exports.config['browserstackKey'] }, function (error) {
        if (error) return reject(error);
        console.log('Browserstack connected. Now testing...');
        resolve();
      });
    });

  },

  // Code to stop browserstack local after end of test
  afterLaunch: function () {
    return new Promise(function (resolve, reject) {
      exports.bs_local.stop(resolve);
      console.log("Stopped Browserstack.");
      xmlReportHelper.mergeJUnitReports();
    });
  }
};