module.exports = function(grunt) {
	grunt.loadNpmTasks("jasmine");

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json')
	});

	grunt.registerTask("default", function() {
		console.log("Available tasks:");
		console.log("");
		console.log("  specs   - Run jasmine tests.");
	});
};