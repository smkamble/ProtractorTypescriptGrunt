"use strict";
/**
 * Created by Sachin on 27/11/2019.
 */
Object.defineProperty(exports, "__esModule", { value: true });
const util_1 = require("util");
const log4j = require("log4js");
const logDir = "./testReports/logs/";
const fileName = "AutomationLog";
const date = new Date().getDate() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getFullYear();
const fullFileName = fileName + "-" + date + ".log";
let log = "";
const logLevel = "DEBUG";
class Logger {
    constructor(logLevel) {
        this.logLevel = logLevel;
        this.getLog = (logFileName) => {
            if (util_1.isNullOrUndefined(logFileName)) {
                log = log4j.getLogger();
            }
            else {
                logFileName = "[" + logFileName + "]";
                log = log4j.getLogger(logFileName);
            }
            return log;
        };
        log4j.configure({
            appenders: { cheese: { type: "file", filename: logDir + fullFileName }, console: { type: "console" } },
            categories: { default: { appenders: ["cheese", "console"], level: logLevel } }
        });
    }
}
exports.Logger = Logger;
Logger.getInstance = (logLevel) => {
    if (!Logger.logger) {
        Logger.logger = new Logger(logLevel);
    }
    return Logger.logger;
};
