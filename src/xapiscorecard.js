var XapiScoreCard = require("./xapiscorecard/XapiScoreCard");

var sc = new XapiScoreCard();
sc.loadConfig("test/test.json");
sc.run().then(
	function() {

	},
	function() {

	}
)