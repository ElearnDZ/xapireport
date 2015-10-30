var XapiReportColumn = require("../../src/xapireport/XapiReportColumn");
var statementData = require("../data/statementdata.json");
var TinCan = require("tincanjs");

describe("XapiReportColumn", function() {
	it("can be set up with parameters", function() {
		var column = new XapiReportColumn();

		expect(function() {
			column.parseConfig({
				"blabla": "xyxyxyx"
			})
		}).toThrow();

		column.parseConfig({
			"verbId": "http://hello",
			"aggregateType": "min",
			"aggregateField": "score"
		});

		expect(column.filter.verbId).toEqual("http://hello");
	});
});