"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const protractor_1 = require("protractor");
const loginPage_1 = require("../pages/loginPage");
const basePage_1 = require("../pages/basePage");
var originalTimeout;
var properties = require('../support/properties.json');
describe("Password Page Scenarios", () => {
    //Globally
    var loginPage = new loginPage_1.LoginPage();
    var basePage = new basePage_1.BasePage();
    beforeEach(async function () {
        await protractor_1.browser.driver.sleep(properties.timeout1);
    });
    afterEach(async () => {
        await protractor_1.browser.driver.sleep(properties.timeout1);
    });
    it("Validate Successful password", async () => {
        basePage.OpenBrowser(properties.url);
        await loginPage.enterPassword(properties.login.password_user);
    });
});
