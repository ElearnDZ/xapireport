#!/usr/bin/env node

var XapiReport = require("./xapireport/XapiReport");
var minimist = require("minimist");
var fs = require("fs");

function usage() {
	console.log("xapireport - Create spreadsheet like report based on xapi data.");
	console.log();
	console.log("At least the option xapiEndpoint and columns needs to specified.");
	console.log();
	console.log("The options can be specified in the json config file or on the");
	console.log("command line prefixed by --.");
	console.log();
	console.log("Options:");
	console.log("    config: <filename.json>  - Read config file.");
	console.log("    xapiEndpoint: <url>      - Specify xApi endpoint url.");
	console.log("    xapiUser: <username>     - Specify xApi username.");
	console.log("    xapiPassword: <pw>       - Specify xApi password.");
	console.log("    columns: <json>          - Column definitions.");
	console.log("    limit: <number>          - Limit number of statements in each call.");
	console.log("    csv: <filename.csv>      - Save information to csv file.");
	console.log();

	process.exit(1);
}

var config = minimist(process.argv.slice(2));
if (config["config"]) {
	var jsonConfig = JSON.parse(fs.readFileSync(config["config"]));
	for (var o in jsonConfig)
		config[o] = jsonConfig[o];
}

if (!config["csv"] && !config["xapiEndpoint"])
	usage();

if (config._.length)
	usage();

delete config._;

var sc = new XapiReport();

try {
	sc.parseConfig(config);
}

catch (e) {
	console.log(e.message);
	process.exit(1);
}

sc.run().then(
	function() {},
	function(e) {
		console.log(e);
		process.exit(1);
	}
)