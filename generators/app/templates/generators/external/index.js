const Generator = require('yeoman-generator');
const { stripIndent } = require("common-tags")
const path = require('path')
const fs = require('fs-extra')

module.exports = class extends Generator {
	/*
	 * Constructor
	 */
	constructor(args, opts) {
		super(args, opts);

		// flag for install
		this.option("install", {
			desc: "Prevent full installation",
			type: Boolean,
			default: false
		})

		this.log("templating files...")
	}	

	/*
	 * Prompt user for input
	 */
	async prompting() {
		const answers = await this.prompt([
		{
			// Author name
			type: "input",
			name: "author",
			message: "author",
			default: "George L Sun" // default
		},
		{
			// Project (generator) name
			type: "input",
			name: "name",
			message: "project name",
			default: this.appname // Default to current folder name
		},
		{
			// Project description
			type: "input",
			name: "description",
			message: "description",
			default: "description of " + this.appname // default
		},
		{
			// Packages to include
			type: "input",
			name: "packages",
			message: "list required packages (separated by spaces)",
			default: null
		},
		{
			// Include dev and test packages?
			type: "boolean",
			name: "devpackages",
			message: "include test packages (mocha, chai, gulp, etc.)", 	
			default: false
		},
		{
			// Type of file hierarchy templating
			type: "list",
			name: "type",
			message: "template location [internal (standard), external]",
			choices: ["internal", "external"],
			default: "internal"
		},
		{
			// If external, which git repo to use?
			when: (answers) => {
				return ("external" === answers.type)
			},
			type: "input",
			name: "repo",
			message: "which external repo would you like to reference?",
			default: null
		},
		]);
	
		// save answers
		this.answers = answers;
	}

	/* 
	 * Write
	 */
	writing() {
		// install root files and folders
		var input_packages = this.answers.packages.split(" ")
		var packages = input_packages.reduce((c, p) => {
			return c + '"' + p + '": \"*\",\n\t\t' 
		}, "")
		packages = packages.slice(0, -4)

		if (this.answers.devpackages) {
			var devpackages = stripIndent`
				"gulp": "*",
				\t\t"mocha": "*",
				\t\t"chai": "*",
				\t\t"yeoman-test": "*",
				\t\t"yeoman-assert": "*"`.trim()
			var scripts = stripIndent`
				"test": "mocha -u bdd -R spec -t 500 --recursive",
				\t\t"watch": "mocha -u bdd -R spec -t 500 --recursive --watch"
			`.trim()
		} else {
			var devpackages = ""
			var scripts = ""
		}
		
		// Tempalte files except the generators
		this.fs.copyTpl(
			this.templatePath("*"),
			this.destinationPath(),
			{
				author: this.answers.author,
				name: this.answers.name,
				description: this.answers.description,
				scripts: scripts,
				packages: packages,
				devpackages: devpackages
			},
			{},
			{
				globOptions: {
					ignore: ["generators"],
					dot: true
				}
			}
		)

		// switch statement for internal, external, or both templating
		switch (this.answers.type) {
			case "internal": 
				var template_path = "generators/internal/*"
				this.fs.copyTpl(
					this.templatePath(template_path),
					this.destinationPath("generators/app")
				)
				break

			case "external":
				var template_path = "generators/external/*"
				this.fs.copyTpl(
					this.templatePath(template_path),
					this.destinationPath("generators/app")
				)
				fs.mkdirp("templates") // create a template git dir
		}
	}

	/* 
	 * Install
	 */
	install() {
		this.composeWith(
			require.resolve(path.join(__dirname, "..", "install")), 
			{
				install: this.options.install,
				repo: this.answers.repo
			}
		)
	}

	end() {
		this.log("...tidying up")
	}
};