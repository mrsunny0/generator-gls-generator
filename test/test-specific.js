const helpers = require('yeoman-test');
const assert = require('chai')
const { exec } = require("child_process")
const { spawn } = require("child_process")
const config = require("./config.js")
const answerPrompts = config.answerPrompts
const deleteDir = config.deleteDir

describe("Specific test", () => {
    it('Manually input, specific test', () => {
        var answers = {
            packages: "path express",
            type: "custom",
            repo: "https://github.com/octocat/Hello-World",
            devpackages: true,
        }
        var options = {
            install: true
        }
        answerPrompts(answers, options, [], "test-specific")
    })
})