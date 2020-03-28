const Generator = require('yeoman-generator');

module.exports = class extends Generator {
	/*
	 * Constructor
	 */
	constructor(args, opts) {
        super(args, opts);
	}	

	/* 
	 * Install
	 */
	install() {
		// clone external repo, if present
		if (this.options.repo) {
			this.spawnCommandSync(
				"git",
				['init']
			)
			this.spawnCommandSync(
				"git", 
				["submodule", "add", this.options.repo],
				{
					cwd: "templates/"
				}
			)
		}

		// npm install if install flag is present
		if (this.options.install) {
			this.spawnCommandSync(
				"npm",
				["install"]
			)
		}
	}

	end() {
		// this.log("...tidying up")
	}
};