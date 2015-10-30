var TinCan = require("tincanjs");
var statementData = require("../data/statementdata.json");
var StatementAggregator = require("../../src/xapireport/StatementAggregator");

describe("StatementAggregator", function() {
	it("can get a value from a statement", function() {
		var statements = [];
		statements.push(new TinCan.Statement.fromJSON(JSON.stringify(statementData[0])));
		statements.push(new TinCan.Statement.fromJSON(JSON.stringify(statementData[1])));

		var aggregator = new StatementAggregator();

		expect(aggregator.getStatementValue(statements[0])).toEqual(123);
	});

	it("can process statements", function() {
		var statements = [];
		statements.push(new TinCan.Statement.fromJSON(JSON.stringify(statementData[0])));
		statements.push(new TinCan.Statement.fromJSON(JSON.stringify(statementData[1])));

		var aggregator = new StatementAggregator();
		aggregator.processStatement(statements[0]);
		expect(aggregator.getAggregatedValue("bob@example.com")).toEqual(1);
		aggregator.processStatement(statements[1]);
		expect(aggregator.getAggregatedValue("bob@example.com")).toEqual(2);


		var aggregator = new StatementAggregator();
		aggregator.setAggregateType(StatementAggregator.MIN);
		aggregator.processStatement(statements[0]);
		aggregator.processStatement(statements[1]);
		expect(aggregator.getAggregatedValue("bob@example.com")).toEqual(123);

		var aggregator = new StatementAggregator();
		aggregator.setAggregateType(StatementAggregator.MAX);
		aggregator.processStatement(statements[0]);
		aggregator.processStatement(statements[1]);
		expect(aggregator.getAggregatedValue("bob@example.com")).toEqual(200);

		var aggregator = new StatementAggregator();
		aggregator.setAggregateType(StatementAggregator.MAX);
		aggregator.setAggregateField(StatementAggregator.TIMESTAMP);
		aggregator.processStatement(statements[0]);
		aggregator.processStatement(statements[1]);
		expect(aggregator.getAggregatedValue("bob@example.com")).toEqual("2014-08-13T10:55:32.000Z");
	});

	it("has a configurable date format", function() {
		var statements = [];
		statements.push(new TinCan.Statement.fromJSON(JSON.stringify(statementData[0])));
		statements.push(new TinCan.Statement.fromJSON(JSON.stringify(statementData[1])));

		var aggregator = new StatementAggregator();
		aggregator.setAggregateType(StatementAggregator.MAX);
		aggregator.setAggregateField(StatementAggregator.TIMESTAMP);
		aggregator.setDateFormat("YYYY");
		aggregator.processStatement(statements[0]);
		aggregator.processStatement(statements[1]);

		expect(aggregator.getAggregatedValue("bob@example.com")).toEqual("2014");

		aggregator.setDateFormat("YYYY MMM D");
		expect(aggregator.getAggregatedValue("bob@example.com")).toEqual("2014 Aug 13");
	});
});