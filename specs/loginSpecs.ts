
import { browser, element, by, protractor, $$, $ } from 'protractor';
import { LoginPage } from "../pages/loginPage";
import { BasePage } from "../pages/basePage";

var originalTimeout;
var properties = require('../support/properties.json');
describe("Login Page Scenarios", () => {
    //Globally
    var loginPage = new LoginPage();
    var basePage = new BasePage();

    beforeEach(async function () {
        await browser.driver.sleep(properties.timeout1);
    });

    afterEach(async () => {
        await browser.driver.sleep(properties.timeout1);
    });

    it("Validate Successful Login with Admin User,Title,Sitelogo", async () => {
        basePage.OpenBrowser(properties.url);
        expect(loginPage.loginPageDisplay()).toMatch(properties.loginPage.incomeManagement_lbl);
        await loginPage.LoginSuccessfull(properties.login.user, properties.login.password_user, properties.login.consortium_user);
    })
    xit("Validate Successful Username", async () => {
        basePage.OpenBrowser(properties.url);
        await loginPage.enterUserName(properties.login.user);
    })
});