var XapiReport = require("./xapireport/XapiReport");
var minimist = require("minimist");
var fs = require("fs");

function usage() {
	console.log("xapireport - Create spreadsheet like report based on xapi data.");
	console.log();
	console.log("At least the option --xapiEndpoint needs to specified.");
	console.log();
	console.log("Options:");
	console.log("    --config=<filename.json>  - Read config file.");
	console.log("    --xapiEndpoint=<url>      - Specify xApi endpoint url.");
	console.log("    --xapiUser=<username>     - Specify xApi username.");
	console.log("    --xapiPassword=<pw>       - Specify xApi password.");
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

var sc = new XapiReport();
sc.loadConfig("test/testconf.json");
sc.run().then(
	function() {},
	function(e) {
		console.log("error");
		console.log(e);
		process.exit(1);
	}
)