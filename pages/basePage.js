"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const protractor_1 = require("protractor");
var BPromise = require("bluebird");
const request = BPromise.promisifyAll(require("request-promise"));
var properties = require("../support/properties.json");
var protractorImageComparison = require("protractor-image-comparison");
var AxeBuilder = require("axe-webdriverjs");
var AxeReports = require("axe-reports");
var AXE_BUILDER = AxeBuilder(protractor_1.browser)
    .withTags(['wcag2a', 'wcag2aa', 'section508', 'best-practice', 'experimental', 'cat']);
//.withRules(["color-contrast"]);
var ElementWaitType;
(function (ElementWaitType) {
    ElementWaitType["ISPRESENT"] = "present";
    ElementWaitType["ISDISPLAYED"] = "display";
    ElementWaitType["ISENABLED"] = "enabled";
})(ElementWaitType = exports.ElementWaitType || (exports.ElementWaitType = {}));
;
class BasePage {
    constructor() {
        /*
       * Waiting for an element to be present
       * @type : element
       * @type : Wait time (optional)
       * @return : returns true if element present
       */
        this.waitUntilReady = async (element, elementWaitType) => {
            let elementWait = 30000; // 30 secs;
            const _retryOnErr = () => {
                return false;
            };
            switch (elementWaitType) {
                case "present":
                    return protractor_1.browser.driver.wait(() => {
                        return element.isPresent().then((isPresent) => {
                            if (isPresent) {
                                return true;
                            }
                            else {
                                return _retryOnErr();
                            }
                        }, _retryOnErr(Error));
                    }, elementWait).then((waitRetValue) => {
                        return waitRetValue; // usually just `true`
                    }, (err) => {
                        const desc = "Element '" + element.locator() + "' Not Present. ";
                        console.error(err);
                        console.error(desc + err.message);
                    });
                case "display":
                    return protractor_1.browser.driver.wait(() => {
                        return element.isDisplayed().then((isDisplayed) => {
                            if (isDisplayed) {
                                return true;
                            }
                            if (!isDisplayed) {
                                console.log("wait... Element '", element.locator(), "' found but hidden.");
                                // return false;
                            }
                        }, _retryOnErr(Error));
                    }, elementWait).then((waitRetValue) => {
                        return waitRetValue; // usually just `true`
                    }, async (err) => {
                        const desc = "Element --'" + element.locator() + "' Not Displayed. ";
                        console.error(err);
                        console.error(desc + err.message);
                    });
                case "enabled":
                    return protractor_1.browser.driver.wait(() => {
                        return element.isEnabled().then((isEnabled) => {
                            if (isEnabled) {
                                console.log("waitUntilReady:-", "Element '", element.locator(), "' is Enabled.");
                                return true;
                            }
                            else {
                                return _retryOnErr();
                            }
                        }, _retryOnErr(Error));
                    }, elementWait).then((waitRetValue) => {
                        return waitRetValue; // usually just `true`
                    }, async (err) => {
                        const desc = "Element --'" + element.locator() + "' Not Enabled. ";
                        console.error(err);
                        console.error(desc + err.message);
                    });
                default:
                    console.error("Currently '" + elementWaitType + "' Not implemented.");
                    break;
            }
        };
    }
    OpenBrowser(url) {
        protractor_1.browser.get(url);
        protractor_1.browser.manage().window().maximize();
    }
    getRandomNumber(numberLength) {
        var randomNumber = "";
        var possible = "0123456789";
        for (var i = 0; i < numberLength; i++)
            randomNumber += possible.charAt(Math.floor(Math.random() * possible.length));
        return randomNumber;
    }
    checkAccesiblity_base(filename) {
        return AXE_BUILDER.analyze()
            .then(function (results) {
            return AxeReports.processResults(results, "csv", "./testReports/accessiblityReports/" + filename, true);
        })
            .then(() => {
            //this.compareImge(filename);
            Promise.resolve(true);
        });
    }
    async imageCompare(filename) {
        if (protractor_1.browser.params.imagecompare == true) {
            protractor_1.browser.protractorImageComparison = await new protractorImageComparison({
                baselineFolder: "./testReports/imageComparision/baseline/",
                screenshotPath: "./testReports/imageComparision/screenshots/",
                autoSaveBaseline: true
            });
            expect(protractor_1.browser.protractorImageComparison.checkScreen(filename)).toEqual(0);
        }
    }
    varLanguage() {
        var properties;
        if (protractor_1.browser.params.language == "welsh") {
            properties = require("../../support/welsh.json");
        }
        else {
            properties = require("../../support/properties.json");
        }
        return properties;
    }
    scrollDown() {
        protractor_1.browser.sleep(properties.timeout2);
        protractor_1.browser.executeScript('window.scrollTo(0,600)');
        protractor_1.browser.sleep(properties.timeout2);
    }
    scrollUp() {
        protractor_1.browser.sleep(properties.timeout2);
        protractor_1.browser.executeScript('window.scrollTo(0,-600)');
        protractor_1.browser.sleep(properties.timeout2);
    }
    //Generete an token & Perform Delete Request using Request Promise library
    async apiDelRequest(url, apiparam, id) {
        var postResponse, postStringResponse, postJsonResponse, deleteResponse;
        var apiurl = url + apiparam + "/" + id;
        const postoptions = {
            strictSSL: false,
            method: 'POST',
            uri: url + 'token',
            header: { "content-type": "application/json" },
            body: properties.apijson,
            json: true,
        };
        try {
            //var deferred = protractor.promise.defer();
            var postResponse = await request(postoptions);
            postStringResponse = (JSON.stringify(postResponse));
            postJsonResponse = JSON.parse(postStringResponse || '{}');
            //console.log("Body: " + postjsonResponse.token);
            var token = postJsonResponse.token;
            const bearer = 'Bearer ' + token;
            var deleteoptions = {
                strictSSL: false,
                method: 'DELETE',
                uri: apiurl,
                headers: {
                    'Authorization': bearer,
                    'content-type': 'application/json;charset=utf-8'
                },
                json: true,
            };
            try {
                deleteResponse = await request(deleteoptions);
                console.log("DELETE-API request executed succesfully for ID :" + id);
            }
            catch (error) {
                if (error.statusCode == 400) {
                    console.log("DELETE-Record not available for ID :" + id + " and Status code :" + error.statusCode);
                }
                else {
                    console.log("DELETE-Error for ID :" + id + " & Status code :" + error.statusCode);
                }
            }
        }
        catch (error) {
            console.log("POST-Error while creating token for ID: " + id + " & Status code is: " + error.statusCode);
        }
        Promise.resolve(true);
    }
}
exports.BasePage = BasePage;
