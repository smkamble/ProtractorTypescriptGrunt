/*
 * author : Sachin Kamble
 * created on : 18 Nov 2019
 * modified by :
 * last modified on:  
 */

//import the class
import { browser, element, by, protractor, $$, $, ExpectedConditions, ElementFinder } from 'protractor';
import { BasePage, ElementWaitType } from "./basePage";
import {Logger} from "../Library/logger";

var until = protractor.ExpectedConditions;
browser.waitForAngularEnabled(false);
const logger: any = Logger.getInstance("DEBUG").getLog("Utils");

export class LoginPage extends BasePage {
    //All heading                           
    heading: ElementFinder = element(by.css("#im-login-header .im-system-name"));
    userName: ElementFinder = element(by.id("username"));
    passWord: ElementFinder = element(by.id("password"));
    consorTium: ElementFinder = element(by.id("consortiumCode"));
    loginButton: ElementFinder = element(by.id("im-btn-login"));

    async loginPageDisplay() {
        try {
            await this.waitUntilReady(this.heading, ElementWaitType.ISPRESENT);
            //await browser.wait(ExpectedConditions.presenceOf(this.heading), 10000);
            return await this.heading.getText();
        }
        catch (error) {
            logger.error("Login Page not display :" + error);
            throw new Error("Login Page not display :" + error);
        }
    }

    async enterUserName(username: string) {
        try {
            await this.waitUntilReady(this.userName, ElementWaitType.ISPRESENT);
            await this.userName.clear();
            await this.userName.sendKeys(username);
            await logger.info(username +  " entered successfully...");
        }
        catch (error) {
            logger.error("error. Unable to enter value..." + error.message);
            throw new Error("Error while entering username :" + error.message);
        }
    }

    async enterPassword(password: string) {
        try {
            await this.waitUntilReady(this.passWord, ElementWaitType.ISPRESENT);
            await this.passWord.clear();
            await this.passWord.sendKeys(password);
            await logger.info(password +  " entered successfully...");
        }
        catch (error) {
            throw new Error("Error while entering password :" + error);
        }
    }

    async enterConsorTium(consortium: string) {
        try {
            await this.consorTium.clear();
            await this.consorTium.sendKeys(consortium);
            await logger.info(consortium +  " entered successfully...");
        }
        catch (error) {
            throw new Error("Error while entering consorTium :" + error);
        }
    }

    async clickLoginButton() {
        try {
            await this.loginButton.click();
            await logger.info( "Login button clicked successfully...");
        }
        catch (error) {
            throw new Error("Error while click on login button :" + error);
        }

    }


    async LoginSuccessfull(username: string, password: string, consortium: string) {
        await this.enterUserName(username);
        await this.enterPassword(password);
        await this.enterConsorTium(consortium);
        await this.checkAccesiblity_base("LoginPage");
        await this.imageCompare("LoginPage");
        await this.clickLoginButton();
    }
}