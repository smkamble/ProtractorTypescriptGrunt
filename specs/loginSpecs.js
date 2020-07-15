"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const protractor_1 = require("protractor");
const loginPage_1 = require("../pages/loginPage");
const basePage_1 = require("../pages/basePage");
var originalTimeout;
var properties = require('../support/properties.json');
describe("Login Page Scenarios", () => {
    //Globally
    var loginPage = new loginPage_1.LoginPage();
    var basePage = new basePage_1.BasePage();
    beforeEach(async function () {
        await protractor_1.browser.driver.sleep(properties.timeout1);
    });
    afterEach(async () => {
        await protractor_1.browser.driver.sleep(properties.timeout1);
    });
    it("Validate Successful Login with Admin User,Title,Sitelogo", async () => {
        basePage.OpenBrowser(properties.url);
        expect(loginPage.loginPageDisplay()).toMatch(properties.loginPage.incomeManagement_lbl);
        await loginPage.LoginSuccessfull(properties.login.user, properties.login.password_user, properties.login.consortium_user);
    });
    xit("Validate Successful Username", async () => {
        basePage.OpenBrowser(properties.url);
        await loginPage.enterUserName(properties.login.user);
    });
});
