
import { browser, element, by, protractor, $$, $ } from 'protractor';
import { LoginPage } from "../pages/loginPage";
import { BasePage } from "../pages/basePage";

var originalTimeout;
var properties = require('../support/properties.json');
describe("Password Page Scenarios", () => {
    //Globally
    var loginPage = new LoginPage();
    var basePage = new BasePage();

    beforeEach(async function () {
        await browser.driver.sleep(properties.timeout1);
    });

    afterEach(async () => {
        await browser.driver.sleep(properties.timeout1);
    });

    it("Validate Successful password", async () => {
        basePage.OpenBrowser(properties.url);
        await loginPage.enterPassword(properties.login.password_user);
    })
});