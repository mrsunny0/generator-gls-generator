const helpers = require('yeoman-test');
const assert = require('chai')
const path = require('path')
const fs = require('fs-extra')
const { exec } = require("child_process")
const { spawn } = require("child_process")

// remove content
fs.removeSync("test-template/*")

describe("Test package installations", () => {
    // see if package.json templates properly
    it('inspect package.json', () => {
        return helpers
            .run(path.join(__dirname, "../generators/app"))
            .inDir(path.join(__dirname, "test-dir"))
            // .inTmpDir(path.join(__dirname, "test-template"))
            .withOptions({})
            .withArguments([])
            .withPrompts({
                name: 'test',
                author: 'test-name',
                description: 'test-description',
                packages: 'path js test',
                devpackages: true,
                type: 'internal'
            }).then(() => {
                exec("cat package.json", (error, stdout, stderr) => {
                    console.log(stdout)
                })
            })
    })

    // test empty package
    it('inspect package.json', () => {
        return helpers
            .run(path.join(__dirname, "../generators/app"))
            .inDir(path.join(__dirname, "test-dir"))
            .withOptions({})
            .withArguments([])
            .withPrompts({
                name: 'test',
                author: 'test-name',
                description: 'test-description',
                type: 'internal'
            }).then(() => {
                exec("cat package.json", (error, stdout, stderr) => {
                    console.log(stdout)
                })
            })
    })

    // // install npm packages
    // it('install npm packages', () => {
    //     return helpers
    //         .run(path.join(__dirname, "../generators/app"))
    //         .inDir(path.join(__dirname, "test-template"))
    //         .withOptions({install: true})
    //         .withArguments([])
    //         .withPrompts({
    //             name: 'test',
    //             author: 'test-name',
    //             description: 'test-description',
    //             packages: 'path js test',
    //             devpackages: true,
    //             type: 'internal'
    //         }).then(() => {
    //         }).on('end', done()) // <- need to tell promise to finish
    // })
})

describe("Test external templating", () => {
    // check external
    it('get external git repo', () => {
        return helpers
            .run(path.join(__dirname, "../generators/app"))
            .inDir(path.join(__dirname, "test-dir"))
            .withOptions({install: false})
            .withArguments([])
            .withPrompts({
                name: 'test',
                author: 'test-name',
                description: 'test-description',
                type: 'external',
                packages: "path",
                repo: "https://github.com/octocat/Hello-World"
            }).then(() => {
            })
    })
})