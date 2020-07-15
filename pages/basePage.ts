/*
 * author : Sachin Kamble
 * created on : 18 Nov 2019
 * modified by :
 * last modified on:  
 */
import { isUndefined } from "util";
import { browser, element, by, protractor, $$, $, ElementFinder } from "protractor";
var BPromise = require("bluebird");
const request = BPromise.promisifyAll(require("request-promise"));
var properties = require("../support/properties.json");
var protractorImageComparison = require("protractor-image-comparison");

var AxeBuilder = require("axe-webdriverjs");
var AxeReports = require("axe-reports");
var AXE_BUILDER = AxeBuilder(browser)
    .withTags(['wcag2a', 'wcag2aa', 'section508', 'best-practice', 'experimental', 'cat'])
//.withRules(["color-contrast"]);


export enum ElementWaitType {
    ISPRESENT = "present",
    ISDISPLAYED = "display",
    ISENABLED = "enabled"
};

export class BasePage {

    OpenBrowser(url: string) {
        browser.get(url);
        browser.manage().window().maximize();
    }

    getRandomNumber(numberLength: number) {
        var randomNumber = "";
        var possible = "0123456789";
        for (var i = 0; i < numberLength; i++)
            randomNumber += possible.charAt(
                Math.floor(Math.random() * possible.length)
            );
        return randomNumber;
    }

    checkAccesiblity_base(filename: string) {
        return AXE_BUILDER.analyze()
            .then(function (results: any) {
                return AxeReports.processResults(
                    results,
                    "csv",
                    "./testReports/accessiblityReports/" + filename,
                    true
                );
            })
            .then(() => {
                //this.compareImge(filename);
                Promise.resolve(true);
            });
    }

    public async imageCompare(filename: string) {
        if (browser.params.imagecompare == true) {
            browser.protractorImageComparison = await new protractorImageComparison({
                baselineFolder: "./testReports/imageComparision/baseline/",
                screenshotPath: "./testReports/imageComparision/screenshots/",
                autoSaveBaseline: true
            });
            expect(browser.protractorImageComparison.checkScreen(filename)).toEqual(0);
        }
    }

    varLanguage() {
        var properties;
        if (browser.params.language == "welsh") {
            properties = require("../../support/welsh.json");
        }
        else {
            properties = require("../../support/properties.json");
        }
        return properties;
    }


    scrollDown() {
        browser.sleep(properties.timeout2);
        browser.executeScript('window.scrollTo(0,600)');
        browser.sleep(properties.timeout2);
    }

    scrollUp() {
        browser.sleep(properties.timeout2);
        browser.executeScript('window.scrollTo(0,-600)');
        browser.sleep(properties.timeout2);
    }


    /*
   * Waiting for an element to be present
   * @type : element
   * @type : Wait time (optional)
   * @return : returns true if element present
   */
    public waitUntilReady = async (element: ElementFinder, elementWaitType: string) => {

        let elementWait: number = 30000; // 30 secs;

        const _retryOnErr: any = () => {
            return false;
        };
        switch (elementWaitType) {
            case "present":
                return browser.driver.wait(() => {
                    return element.isPresent().then((isPresent: boolean) => {
                        if (isPresent) {
                            return true;
                        } else {
                            return _retryOnErr();
                        }
                    }, _retryOnErr(Error));
                }, elementWait).then((waitRetValue: any) => {
                    return waitRetValue; // usually just `true`
                }, (err: Error) => {
                    const desc: string = "Element '" + element.locator() + "' Not Present. ";
                    console.error(err);
                    console.error(desc + err.message);
                });
            case "display":
                return browser.driver.wait(() => {
                    return element.isDisplayed().then((isDisplayed: boolean) => {
                        if (isDisplayed) {
                            return true;
                        }
                        if (!isDisplayed) {
                            console.log("wait... Element '", element.locator(), "' found but hidden.");
                            // return false;
                        }
                    }, _retryOnErr(Error));
                }, elementWait).then((waitRetValue: any) => {
                    return waitRetValue; // usually just `true`
                }, async (err: Error) => {
                    const desc: string = "Element --'" + element.locator() + "' Not Displayed. ";
                    console.error(err);
                    console.error(desc + err.message);
                });

            case "enabled":
                return browser.driver.wait(() => {
                    return element.isEnabled().then((isEnabled: boolean) => {
                        if (isEnabled) {
                            console.log("waitUntilReady:-", "Element '", element.locator(), "' is Enabled.");
                            return true;
                        } else {
                            return _retryOnErr();
                        }
                    }, _retryOnErr(Error));
                }, elementWait).then((waitRetValue: any) => {
                    return waitRetValue; // usually just `true`
                }, async (err: Error) => {
                    const desc: string = "Element --'" + element.locator() + "' Not Enabled. ";
                    console.error(err);
                    console.error(desc + err.message);
                });
            default:
                console.error("Currently '" + elementWaitType + "' Not implemented.");
                break;
        }
    };


    //Generete an token & Perform Delete Request using Request Promise library
    async apiDelRequest(url: string, apiparam: string, id: string) {
        var postResponse, postStringResponse, postJsonResponse, deleteResponse;
        var apiurl = url + apiparam + "/" + id;
        const postoptions = {
            strictSSL: false,
            method: 'POST',
            uri: url + 'token',
            header: { "content-type": "application/json" },
            body: properties.apijson,
            json: true, // Automatically stringifies the body to JSON
            // resolveWithFullResponse: true
        };
        try {
            //var deferred = protractor.promise.defer();
            var postResponse = await request(postoptions);
            postStringResponse = (JSON.stringify(postResponse));
            postJsonResponse = JSON.parse(postStringResponse || '{}');
            //console.log("Body: " + postjsonResponse.token);
            var token = postJsonResponse.token
            const bearer = 'Bearer ' + token;
            var deleteoptions = {
                strictSSL: false,
                method: 'DELETE',
                uri: apiurl,
                headers: {
                    'Authorization': bearer,
                    'content-type': 'application/json;charset=utf-8'
                },
                json: true, // Automatically stringifies the body to JSON
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
