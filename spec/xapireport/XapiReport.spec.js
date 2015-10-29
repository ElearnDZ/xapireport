var XapiReport = require("../../src/xapireport/XapiReport");
var lldata = require("../data/lldata.json");
var TinCan = require("tincanjs");

describe("XapiReport", function() {
	it("can parse a config", function() {
		var config = {
			"xapiEndpoint": "http://localhost/repo/learninglocker/public/data/xAPI/",
			"xapiUsername": "7b880fc1f371715ce24309b90e051fcd24d700c3",
			"xapiPassword": "c089ce76ca667862e615995b909f2ddf9acc1795",

			"columns": [{
				"verbId": "http://adlnet.gov/expapi/verbs/completed",
				"objectId": "http://www.example.com/no.ktouch.xml#1",
				"minScore": "100",
				"maxScore": "150",
				"aggregateType": "min",
				"aggregateField": "timestamp"
			}, {
				"verbId": "http://adlnet.gov/expapi/verbs/completed",
				"objectId": "http://www.example.com/no.ktouch.xml#1",
				"minScore": "150",
				"maxScore": "200",
				"aggregateType": "min",
				"aggregateField": "timestamp"
			}, {
				"verbId": "http://adlnet.gov/expapi/verbs/attempted",
				"objectId": "http://www.example.com/no.ktouch.xml#1",
				"aggregateType": "count"
			}]
		};

		var xapireport = new XapiReport();
		xapireport.parseConfig(config);
		expect(xapireport.columns.length).toEqual(3);
	});

	it("can run a report", function() {
		var config = {
			"xapiEndpoint": "http://localhost/repo/learninglocker/public/data/xAPI/",
			"xapiUsername": "7b880fc1f371715ce24309b90e051fcd24d700c3",
			"xapiPassword": "c089ce76ca667862e615995b909f2ddf9acc1795",

			"columns": [{
				"title": "Total Statements"
			}, {
				"title": "Experienced",
				"verbId": "http://adlnet.gov/expapi/verbs/experienced"
			}, {
				"title": "First Norwegian level 1",
				"objectId": "http://www.example.com/no.ktouch.xml#0",
				"aggregateType": "min",
				"aggregateField": "stored"
			}]
		}

		var xapireport = new XapiReport();
		xapireport.parseConfig(config);

		for (var i = 0; i < lldata.statements.length; i++)
			xapireport.processStatement(new TinCan.Statement(lldata.statements[i]));

		var data=xapireport.getData();

		expect(data[1][0]).toEqual("bob@example.com");
		expect(data[2][0]).toEqual("alice@example.com");
		expect(data[1][3]).toEqual("2015-10-23T15:31:58.950Z");
	})
});