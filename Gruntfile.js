
module.exports = function (grunt) {
    var path = require('path');
    const localIdentifier = grunt.option('localIdentifier') || '';
    const specFile = grunt.option('specFileName') === undefined ? 'allScenarios' : grunt.option('specFileName'); //scenarios
    const browserName = grunt.option('browserName') === undefined ? 'chrome' : grunt.option('browserName');
    const browserVersion = grunt.option('browserVersion') === undefined ? browserName.split("_")[1] : grunt.option('browserVersion');
    const baseUrl = grunt.option('baseUrl');
    const cleanDrivers = grunt.option('protractor_clean') === undefined ? false : grunt.option('protractor_clean');
    const browserstack = require("browserstack-local");
    var isTrueImageCompare = grunt.option("imagecompare");
    var suiteName = require('yargs').argv.suite;

    const reportsDir = "testReports";
    const accessibilityDir = "accessiblityReports";
    const imageComapreDir = "imageComparision";
    const accessibilityReports = process.cwd() + "/" + reportsDir + "/" + accessibilityDir;
    const imageComapreReports = process.cwd() + "/" + reportsDir + "/" + imageComapreDir;
    const baselineDir = process.cwd() + "/" + reportsDir + "/" + imageComapreDir + "/" + 'baseline';
    const screenshotsDir = process.cwd() + "/" + reportsDir + "/" + imageComapreDir + "/" + 'screenshots';
    const htmlxmlReports = process.cwd() + "/" + reportsDir + "/html_xml";

    const localConfigFilePath = "./config/protractor.config.js";
    const borwserstackConfigFilePath = "./config/protractor.browserstack.config.js";

    // construct browserStack capabilities
    var browserStackCapabilities = {
        "browserstack.localIdentifier": localIdentifier,
        'project': 'Pay Dot Net',
        "browserstack.local": true,
        "browserstack.debug": true,
        'browserName': browserName,
        build: "PayDotNet_UI_Chrome_Suite" ,
        name: "PayDotNet_UI_Chrome_Suite" ,
        resolution: "1024x768",
        os: "Windows",
        os_version: "10",
        'trustAllSSLCertificates': true,
        'javascriptEnable': true,
        'maxInstances': 2,
        'acceptSslCerts': true,
        'shardTestFiles': true,
    };

    /* set default encoding to utf8 */
    grunt.file.defaultEncoding = 'utf8';

    // Project configuration.
    grunt.initConfig({
        clean: {
            reports: [reportsDir, 'Logs'],
        },

        pkg: grunt.file.readJSON('package.json'),

        mkdir: {
            all: {
                options: {
                    create: [accessibilityReports, imageComapreReports, htmlxmlReports, baselineDir, screenshotsDir]
                },
            },
        },
        shell: {
            options: {
                stdout: true
            },
            protractor_tsc: {
                command: 'node ./node_modules/typescript/bin/tsc'
            },
            protractor_clean: {
                command: 'node ./node_modules/protractor/bin/webdriver-manager clean'
            },
            protractor_install: {
                command: 'node ./node_modules/protractor/bin/webdriver-manager update  --gecko=false'
            },
            grunt_protractor_install: {
                command: 'node ./node_modules/grunt-protractor-runner/scripts/webdriver-manager-update update'
            },
            yarn_install: {
                command: 'yarn install'
            }
        },
        protractor: {
            options: {
                keepAlive: true,    // If false, the grunt process stops when the test fails.
                noColor: false,     // If true, protractor will not use colors in its output.
                args: {             // Arguments passed to the command
                    params: {
                        language: "welsh",
                        imagecompare: isTrueImageCompare
                    }
                },
            },
            local: {
                options: {
                    configFile: localConfigFilePath,
                    keepAlive: true, // If false, the grunt process stops when the test fails.
                    args: {
                        //baseUrl: baseUrl,
                        specs: ['./specs/*.js'],
                        params: {
                            imagecompare: isTrueImageCompare
                        },
                        capabilities: {
                            'browserName': browserName,
                            directConnect: true,
                            maxInstances: 1,
                            //'browserVersion': browserVersion,
                            //shardTestFiles: false
                        }
                    }
                }
            },
            suite01: {
                options: {
                    configFile: localConfigFilePath,
                    keepAlive: true, // If false, the grunt process stops when the test fails.
                    args: {
                        //baseUrl: baseUrl,
                        specs: ['./specs/password.js'],
                        params: {
                            imagecompare: isTrueImageCompare
                        },
                        capabilities: {
                            'browserName': browserName,
                            directConnect: true,
                            maxInstances: 1,
                        }
                    }
                },
            },
            suite02: {
                options: {
                    configFile: localConfigFilePath,
                    keepAlive: true, // If false, the grunt process stops when the test fails.
                    args: {
                        //baseUrl: baseUrl,
                        specs: ['./specs/loginSpecs.js'],
                        params: {
                            imagecompare: isTrueImageCompare
                        },
                        capabilities: {
                            'browserName': browserName,
                            directConnect: true,
                            maxInstances: 1,
                        }
                    },
                }
            },
            e2e: {
                options: {
                    configFile: localConfigFilePath,
                    keepAlive: true, // If false, the grunt process stops when the test fails.
                    args: {
                        //baseUrl: baseUrl,                       
                        directConnect: false,
                        capabilities: [{
                            browserName: browserName,
                            maxInstances: 1,
                            maxSessions: 1,
                            count: 1,
                            shardTestFiles: true,
                            sequential: true,
                            specs: ['./specs/password.js'],
                        }, {
                            browserName: browserName,
                            maxInstances: 1,
                            maxSessions: 1,
                            count: 1,
                            shardTestFiles: true,
                            sequential: true,
                            specs: ['./specs/loginSpecs.js'],
                        }],
                        params: {
                            imagecompare: isTrueImageCompare
                        },
                    },
                }
            },
            single_browserstack: {
                options: {
                    configFile: borwserstackConfigFilePath,
                    keepAlive: true, // If false, the grunt process stops when the test fails.                   
                    args: {
                        //baseUrl: baseUrl,
                        specs: ['./specs/loginSpecs.js'],
                        capabilities: browserStackCapabilities,
                    }
                }
            },
            browserstack: {
                options: {
                    configFile: borwserstackConfigFilePath,
                    keepAlive: true, // If false, the grunt process stops when the test fails.
                    args: {
                        //baseUrl: baseUrl,
                        capabilities: browserStackCapabilities,
                        maxSessions: 2,
                        multiCapabilities: [
                            {
                                'browserName': browserName,
                                maxInstances: 1,
                                maxSessions: 1,
                                count: 1,
                                shardTestFiles: false,
                                sequential: true,
                                specs: ['../Test/AreaTestSpec.js'],
                            },
                            {
                                'browserName': browserName,
                                maxInstances: 1,
                                maxSessions: 1,
                                count: 1,
                                shardTestFiles: false,
                                sequential: true,
                                specs: ['../Test/AccountsTestSpec.js'],
                            }],
                    }
                }
            },
        },
    });

    require('load-grunt-tasks')(grunt);

    // Run tests sequential on local using command "grunt local"
    grunt.registerTask('local', ['install', 'protractor:local']);

    // Run all tests parallely on local using command "grunt test"
    grunt.registerTask('parallel', ['install', 'protractor:e2e']);

    // browserstack tests run using command "grunt browserstack"
    grunt.registerTask('single_browserstack', ['install', 'protractor:single_browserstack']);

    // browserstack multiple tests parallely run using command "grunt browserstack"
    grunt.registerTask('browserstack', ['install', 'protractor:browserstack']);

    //grunt.registerTask('install', ['clean', 'mkdir:all', 'shell:protractor_tsc', 'shell:protractor_clean', 'shell:protractor_install']);
    grunt.registerTask('install', ['clean', 'mkdir:all', 'shell:protractor_tsc', 'shell:protractor_install']);

    grunt.registerTask('localinstall', ['clean', 'mkdir:all', 'shell:protractor_tsc']);
}