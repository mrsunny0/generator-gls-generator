const Generator = require('yeoman-generator');

module.exports = class extends Generator {
	/*
	 * Constructor
	 */
	constructor(args, opts) {
		super(args, opts);

		// flag for no install
		this.option("install", {
			desc: "Prevent full installation",
			type: Boolean,
			default: false
		})

		this.log("templating files...")
	}	

	/*
	 * Paths
	 */
	paths() {}

	/*
	 * Prompt
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
		]);
	
		// save answers
		this.answers = answers;
	}

	writing() {}

	install() {}

	end() {
		this.log("...tidying up")
	}

};