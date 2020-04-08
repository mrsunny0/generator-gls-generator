const helpers = require('yeoman-test');
const assert = require('chai')
const { exec } = require("child_process")
const { spawn } = require("child_process")
const config = require("./config.js")
const answerPrompts = config.answerPrompts
const deleteDir = config.deleteDir

describe("Test package installations", () => {
    // basic testing of standard templating
    context("standard templating", () => {
        it('inspect package.json', () => {
            var answers = {
                packages: "a b c d e",
                devpackages: true,
                type: "standard"
            }
            answerPrompts(answers, {}, [], "test-package-json")
        })
        it('test for duplicate packages in package.json', () => {
            var answers = {
                packages: "a b c d e",
                devpackages: true,
                type: "standard"
            }
            answerPrompts(answers, {}, [], "test-package-duplicates")
        })
        it('inspect standard templating', () => {
            var answers = {
                packages: "path fs-extra NEW",
                devpackages: true,
                type: "standard"
            }
            answerPrompts(answers, {}, [], "test-standard")
                .then(() => {
                    exec("cat package.json", (error, stdout, stderr) => {
                        console.log(stdout)
                    })
                })
        })
    })

    // custom templating
    context("custom templating", () => {
        it('inspect custom/empty templating', () => {
            var answers = {
                type: "custom",
                // repo: ""
            }
            answerPrompts(answers, {}, [], "test-custom1")
        })
        it('inspect custom/repo templating', () => {
            var answers = {
                type: "custom",
                repo: "https://github.com/octocat/Hello-World"
            }
            answerPrompts(answers, {}, [], "test-custom2")
        })
    })

    // installing packages
    context("install", () => {
        it('full install (using standard)', () => {
            var answers = {
                packages: "path fs-extra",
                devpackages: true,
                type: "custom",
                repo: "https://github.com/octocat/Hello-World"
            }
            var options = {
                install: false
            }
            answerPrompts(answers, options, [], "custom-install")
        })
    })
})