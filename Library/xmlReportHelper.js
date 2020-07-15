"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var DEFAULT_SUITE_DIR = 'testReports/html_xml';
const protractor_1 = require("protractor");
var sessionId = "";
var XmlReportHelper = function () {
    this.setupDefaultReporters = function () {
        protractor_1.browser.driver.getSession().then((session) => {
            sessionId = session.getId();
        }).then(() => {
            var jasmineReporters = require('jasmine-reporters');
            var suiteDir = DEFAULT_SUITE_DIR;
            var junitReportFile = 'xml-results-' + sessionId + '-' + Date.now() + '-';
            console.log('JUnit reporter using file: ', junitReportFile);
            var junitReporter = new jasmineReporters.JUnitXmlReporter({
                savePath: suiteDir,
                filePrefix: junitReportFile,
                consolidateAll: false,
                consolidate: true,
                // Use space instead of dot to separate suite names
                useDotNotation: false,
                // Include a timestamp in suite names to make them unique in case of duplicate names
                modifySuiteName: function (suiteName_1, suite) {
                    return suiteName_1 + ' ' + Date.now();
                }
            });
            jasmine.getEnv().addReporter(junitReporter);
        })
    }
    this.mergeJUnitReports = function () {
        console.log('Merging JUnit reports...');
        var suiteDir = DEFAULT_SUITE_DIR;
        var destinationFile = suiteDir + '/xml-results.xml';
        var fs = require('fs');
        var sourceFiles = fs.readdirSync(suiteDir)
            .filter(function (filename) {
                return filename.match(/^xml-results-.*.xml$/);
            })
            .map(function (filename) {
                return suiteDir + '/' + filename;
            });
        console.log('Source JUnit report files: ', sourceFiles);
        var fs = require('fs');
        var startTag = '<testsuites';
        var endTag = '</testsuites>';
        var result = '<?xml version="1.0" encoding="UTF-8" ?>';
        sourceFiles.forEach(function (sourcePath) {
            var contents = fs.readFileSync(sourcePath, 'utf8');
            var startIndex = contents.indexOf(startTag);
            var endIndex = contents.indexOf('</testsuites>');
            var suites = contents.substring(startIndex);
            result += suites;
        });
        fs.writeFileSync(destinationFile, result, 'utf8');
        console.log('JUnit reports merged into file: ', destinationFile);
    }
}
module.exports = XmlReportHelper;
