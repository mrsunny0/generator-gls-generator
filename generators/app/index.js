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

		// default answers
		this.option("default", {
			desc: "Default option",
			type: Boolean,
			default: false
		})

		// flag for install
		this.option("install", {
			desc: "Prevent full installation",
			type: Boolean,
			default: false
		})
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
			default: this.appname.replace("[\s.]", "-") // Default to current folder name
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
			default: ""
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
			message: "template style",
			choices: ["standard", "custom"],
			default: "standard"
		},
		{
			// If external, which git repo to use?
			when: (answers) => {
				return ("custom" === answers.type)
			},
			type: "input",
			name: "repo",
			message: "would you like to place a git repo in this template?, if so, add git URL",
			default: ""
		},
		]);
	
		// save answers
		this.answers = answers;
	}

	/* 
	 * Write
	 */
	writing() {
		//-------------------------------
		// Templating basic files such as 
		// README, package.json, etc.
		//-------------------------------
		var basic_files = () => {
			var default_packages = [
				"yeoman-generator",
				"path",
				"fs-extra",
				"common-tags"
			]

			// Parse packages inputted by the user
			if (this.answers.packages) {
				var input_packages = this.answers.packages.split(" ")
			} else {
				var input_packages = []
			}

			// Combine default packages and user defined while 
			// removing any duplicates, then convert into string
			var joined_packages = default_packages.concat(
				input_packages.filter((p) => {
					return default_packages.indexOf(p) < 0
				})
			)

			var packages = joined_packages.reduce((c, p, i) => {
				if (i < joined_packages.length-1) {
					var delimiter = ',\n\t\t'
				} else {
					var delimiter = ""
				}
				return c + '"' + p + '": \"*\"' + delimiter
			}, "")

			// If devpackages option was chosen, populate
			if (this.answers.devpackages) {
				var devpackages = stripIndent`
					"gulp": "*",
					\t\t"mocha": "*",
					\t\t"chai": "*",
					\t\t"yeoman-test": "*",
					\t\t"yeoman-assert": "*"`.trim()
				var scripts = stripIndent`
					"test": "mocha -u bdd -R spec -t 500",
					\t\t"test-all": "mocha -u bdd -R spec -t 500 --recursive",
					\t\t"watch": "mocha -u bdd -R spec -t 500 --recursive --watch"
				`.trim()
			} else {
				var devpackages = ""
				var scripts = ""
			}

			// Template files except the generators
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
						ignore: ["generators", "test"],
						dot: true
					}
				}
			)
		}
		
		//----------------------------------
		// Create template locations
		// for standard, custom, custom/repo
		//----------------------------------
		var template_files = () => {
			// initialize location of src files and dst files
			var source_path = "generators/app/index.js"
			var destination_path = source_path
			var template_path = ""
			var template_content = ""

			// switch statement for app/index.js standard or custom templating
			switch (this.answers.type) {
				case "standard":				
					template_path = "generators/app/templates"
					template_content = ""
					break
				case "custom":
					template_path = "generators/templates" 
					template_content = stripIndent`
					// create root template folder path 
					\t\tvar sourceRoot = this.sourceRoot() 
					\t\tsourceRoot = path.join(sourceRoot, "../../templates")
					\t\tthis.sourceRoot(sourceRoot) 
					`
					break
			}

			// copy file and template paths
			this.fs.copyTpl(
				this.templatePath(source_path),
				this.destinationPath(destination_path),
				{
					content: template_content
				}
			)

			// create template path, and populate with
			// .placeholder or git repo
			fs.mkdirpSync(template_path) 
			if (this.answers.repo) {
				this.spawnCommandSync(
					"git",
					['init']
				)
				this.spawnCommandSync(
					"git", 
					["submodule", "add", this.answers.repo],
					{
						cwd: template_path
					}
				)
			}
			// or create empty placeholder
			else {
				this.fs.write(
					path.join(this.destinationPath(), template_path, ".placeholder"),
					"# placeholder"
				)
			}

		}

		//------------------------------------
		// Directly copy install sub-generator
		//------------------------------------
		var install_files = () => {
			// copy install sub-generator
			this.fs.copyTpl(
				this.templatePath("generators/install/*"),
				this.destinationPath("generators/install")
			)
		}

		//------------------------------------
		// Template tests 
		//------------------------------------
		this.fs.copy(
			this.templatePath("test/*"),
			this.destinationPath("test")
		)

		// Call functions
		basic_files()
		template_files()
		install_files()
	}

	/* 
	 * Install
	 */
	install() {
		if (this.options.install === true) {
			this.composeWith(
				require.resolve('../install')
			) 
		}
	}

	/* 
	 * End
	 */
	end() {
		this.log("...tidying up")
	}
};