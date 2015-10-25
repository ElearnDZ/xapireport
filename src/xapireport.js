var XapiReport = require("./xapireport/XapiReport");

var sc = new XapiReport();
sc.loadConfig("test/testconf.json");
sc.run().then(
	function() {

	},
	function() {

	}
)