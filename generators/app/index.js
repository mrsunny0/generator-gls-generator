const Generator = require('yeoman-generator');

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

		// flag for generator link
		this.option("link", {
			desc: "Link generator",
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
			type: "input",
			name: "name",
			message: "project name",
			default: this.appname // Default to current folder name
		},
		{
			type: "input",
			name: "description",
			message: "description",
			default: "description of " + this.appname
		},
		{
			type: "input",
			name: "packages",
			message: "list required packages (separated by spaces)",
			default: null
		},
		{
			type: "list",
			name: "type",
			message: "template location [internal (standard), external, both]",
			choices: ["internal", "external", "both"],
			default: "internal"
		},
		{
			when: (answers) => {
				return ("external" === answers.type)
			},
			type: "input",
			name: "repo",
			message: "which external repo would you like to reference?",
			default: null
		},
		{
			when: (answers) => {
				return (answers.repo)
			},
			type: "boolean",
			name: "clone",
			message: "would you like to clone this repo?",
			default: false
		}
		]);
	
		// save answers
		this.answers = answers;
	}

	/* 
	 * Write
	 */
	writing() {
		// switch between internal, external, or both templating
		switch (this.answers.type) {
			case "internal":
				// ignore external sub-generator and the external template folder
				var ignore = ["**/external", "/templates"]
				break
			case "external":
				// ignore internal sub-generator
				var ignore = ["**/internal"]
				// copy external template folder
				this.fs.copyTpl(
					this.templatePath("templates/**/*"),
					this.destinationPath("templates"),
					{},
					{},
					{
						globOptions: {
							dot: true
						}
					}
				)
				break
			case "both":
				// ignore none
				var ignore = []
				break
		}

		// install relevant paths, and using ignores from switch case
		this.fs.copyTpl(
			this.templatePath("**/*"),
			this.destinationPath(),
			{
				name: this.answers.name,
				description: this.answers.description,
			},
			{},
			{
				globOptions: {
					ignore: ignore,
					dot: true
				}
			}
		)
	}

	/* 
	 * Install
	 */
	install() {
		// clone external repo
		if (this.answers.clone) {
			this.spawnCommandSync(
				"git",
				['init']
			)
			this.spawnCommandSync(
				"git", 
				["submodule", "add", this.answers.repo],
				{
					cwd: "templates/"
				}
			)
		}

		// install packages
		var packages = this.answers.packages
		if (packages) {
			var package_list = packages.split(" ")
			package_list.forEach((p) => {
				this.log("installing package: " + p)
				if (this.options.install) {
					var flag = '-s'
				} else {
					var flag = ""
				}
				this.spawnCommandSync("npm", ["install", flag, p])
			})
			this.spawnCommandSync("npm", ["install", flag, "yeoman-generator"])
		} else {
			this.log("manually install using npm install")
		}

		// link generator
		if (this.options.link) {
			this.spawnCommandSync("npm", ["link"])
		} else {
			this.log("manually sync generator using npm link")
		}
	}

	end() {
		this.log("...tidying up")
	}
};