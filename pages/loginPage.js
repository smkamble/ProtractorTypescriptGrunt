"use strict";
/*
 * author : Sachin Kamble
 * created on : 18 Nov 2019
 * modified by :
 * last modified on:
 */
Object.defineProperty(exports, "__esModule", { value: true });
//import the class
const protractor_1 = require("protractor");
const basePage_1 = require("./basePage");
const logger_1 = require("../Library/logger");
var until = protractor_1.protractor.ExpectedConditions;
protractor_1.browser.waitForAngularEnabled(false);
const logger = logger_1.Logger.getInstance("DEBUG").getLog("Utils");
class LoginPage extends basePage_1.BasePage {
    constructor() {
        super(...arguments);
        //All heading                           
        this.heading = protractor_1.element(protractor_1.by.css("#im-login-header .im-system-name"));
        this.userName = protractor_1.element(protractor_1.by.id("username"));
        this.passWord = protractor_1.element(protractor_1.by.id("password"));
        this.consorTium = protractor_1.element(protractor_1.by.id("consortiumCode"));
        this.loginButton = protractor_1.element(protractor_1.by.id("im-btn-login"));
    }
    async loginPageDisplay() {
        try {
            await this.waitUntilReady(this.heading, basePage_1.ElementWaitType.ISPRESENT);
            //await browser.wait(ExpectedConditions.presenceOf(this.heading), 10000);
            return await this.heading.getText();
        }
        catch (error) {
            logger.error("Login Page not display :" + error);
            throw new Error("Login Page not display :" + error);
        }
    }
    async enterUserName(username) {
        try {
            await this.waitUntilReady(this.userName, basePage_1.ElementWaitType.ISPRESENT);
            await this.userName.clear();
            await this.userName.sendKeys(username);
            await logger.info(username + " entered successfully...");
        }
        catch (error) {
            logger.error("error. Unable to enter value..." + error.message);
            throw new Error("Error while entering username :" + error.message);
        }
    }
    async enterPassword(password) {
        try {
            await this.waitUntilReady(this.passWord, basePage_1.ElementWaitType.ISPRESENT);
            await this.passWord.clear();
            await this.passWord.sendKeys(password);
            await logger.info(password + " entered successfully...");
        }
        catch (error) {
            throw new Error("Error while entering password :" + error);
        }
    }
    async enterConsorTium(consortium) {
        try {
            await this.consorTium.clear();
            await this.consorTium.sendKeys(consortium);
            await logger.info(consortium + " entered successfully...");
        }
        catch (error) {
            throw new Error("Error while entering consorTium :" + error);
        }
    }
    async clickLoginButton() {
        try {
            await this.loginButton.click();
            await logger.info("Login button clicked successfully...");
        }
        catch (error) {
            throw new Error("Error while click on login button :" + error);
        }
    }
    async LoginSuccessfull(username, password, consortium) {
        await this.enterUserName(username);
        await this.enterPassword(password);
        await this.enterConsorTium(consortium);
        await this.checkAccesiblity_base("LoginPage");
        await this.imageCompare("LoginPage");
        await this.clickLoginButton();
    }
}
exports.LoginPage = LoginPage;
