const Generator = require('yeoman-generator');
const path = require('path');
const fs = require('fs-extra');
const { stripIndent } = require("common-tags")

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
    * Paths
    */
    paths() {
        // create root template folder path 
		var sourceRoot = this.sourceRoot() 
		sourceRoot = path.join(sourceRoot, "../../_templates")
		this.sourceRoot(sourceRoot)
    }

	/*
	 * Prompt user for input
	 */
	async prompting() {
		const answers = await this.prompt([
		{
			type: "input",
			name: "name",
			message: "Project name",
			default: this.appname // Default to current folder name
		},
		{
			type: "input",
			name: "author",
			message: "Author",
			default: "George L. Sun"
		},
		{
			type: "input",
			name: "description",
			message: "Project description",
			default: "Description of: " + this.appname
        },
        // random examples of inquirer
		{
			type: "number",
			name: "number",
			message: "number",
			default: 0,
        },
		{
			type: "confirm",
			name: "icons",
			message: "confirm",
			default: false
        },
		{
			type: "list",
			name: "list",
			message: "list",
			choices: ["apple", "orange", "banana"],
			default: "apple"
        },
		{
			type: "checkbox",
			name: "checkbox",
			message: "checkbox",
			choices: ["apple", "orange", "banana"],
			default: "apple"
		},
		{
			when: function(response) {
				return response.checkbox == "apple"	
			},
			type: "input",
			name: "afterQuestion",
			message: "this came after a prior question",
			default: "NA"
        },
        // rawlist, expand, password, editor (more here: https://github.com/SBoudrias/Inquirer.js/)
		]);
	
		// save answers
		this.answers = answers;
	}

	/* 
	 * Compose multiple generators
	 */
	writing() {
		//----------------------------------
		// Copy some boilerplate code
		//----------------------------------
		var copy_files = () => {
			this.fs.copy(
				this.templatePath(),
				this.destinationPath(),
				{},
				{},
				{
					globOptions: {
						dot: true
					}
				}
			)
		}
		//----------------------------------
		// Template some files
		//----------------------------------
		var template_files = () => {
			this.fs.copyTpl(
				this.templatePath(),
				this.destinationPath(),
				{
					key: value
				},
				{},
				{
					globOptions: {
						ignore: ["a", "b"],
						dot: true
					}
				}
			)
		}
		//----------------------------------
		// Write some custom code
		//----------------------------------
		var write_files = () => {
			this.fs.write(
				path.join(__dirname, "file_name"),
				"contents"
			)
		}

		//----------------------------------
		// Use sub-generator to compose with
		//----------------------------------
		var use_subgenerator = () => {
			this.composeWith(
				require.resolve(path.join(__dirname, "..", "sub")),
				{
					option_value: "option_value"
				}
			)
		}

		// call functions (in order)
		copy_files()
		template_files()
		write_files()
		use_subgenerator()
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