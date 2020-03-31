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
		this.spawnCommandSync(
			"npm",
			["install"]
		)
	}

	/* 
	 * End
	 */
	end() {}
};