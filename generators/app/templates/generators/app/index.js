const Generator = require('yeoman-generator');
const path = require('path');
const fs = require('fs-extra');

console.log(template_finder)

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
        <%- content %>
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
        // rawlist, expand, password, editor (more here: https://github.com/SBoudrias/Inquirer.js/)
		]);
	
		// save answers
		this.answers = answers;
	}

	/* 
	 * Compose multiple generators
	 */
	writing() {
        // copy
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

        // copy from template
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

        // write
        this.fs.write(
            path.join(__dirname, "file_name"),
            "contents"
        )

        // compose
		this.composeWith(
			require.resolve(path.join(__dirname, "..", "sub")),
			{
				option_value: "option_value"
			}
		)
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