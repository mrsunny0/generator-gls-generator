const helpers = require('yeoman-test');
const path = require('path')
const fs = require('fs-extra')

// location of test files
const test_dir = "test-dir"

// removing files
async function deleteDir(dir_name) {
    await fs.emptyDir(
        path.join(
            __dirname,
            test_dir,
            dir_name
        )
    )
}

// Test double to mock prompting
function answerPrompts(answers, options, args, d) {
    // remove contents from dir
    deleteDir(d)

    // return Promise for answer prompts
    return helpers
        .run(path.join(__dirname, "../generators/app"))
        .inDir(path.join(__dirname, test_dir, d))
        .withOptions(options)
        .withArguments(args)
        .withPrompts({
            name: answers.name ? answers.name : "test-name",
            author: answers.author ? answers.author : "test-author",
            description: answers.description ? answers.description : 'test-description',
            packages: answers.packages ? answers.packages : "",
            devpackages: answers.devpackages ? answers.devpackages: true,
            type: answers.type ? answers.type : "standard",
            repo: answers.repo ? answers.repo : ""
        })
}

module.exports = {
    answerPrompts: answerPrompts,
    deleteDir : deleteDir,
    test_dir: test_dir,
}