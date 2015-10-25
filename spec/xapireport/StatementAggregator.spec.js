var TinCan = require("tincanjs");
var statementData = require("../data/statementdata.json");
var StatementAggregator = require("../../src/xapireport/StatementAggregator");

describe("StatementFilter", function() {
	it("can check if a statement matches", function() {

		var statements = [];
		statements.push(new TinCan.Statement.fromJSON(JSON.stringify(statementData[0])));
		statements.push(new TinCan.Statement.fromJSON(JSON.stringify(statementData[1])));

		var aggregator = new StatementAggregator();

		expect(aggregator.aggregate(statements)).toEqual(2);

		aggregator.setAggregateType(StatementAggregator.MIN);
		aggregator.setAggregateField(StatementAggregator.SCORE);
		expect(aggregator.aggregate(statements)).toEqual(123);

		aggregator.setAggregateType(StatementAggregator.MAX);
		aggregator.setAggregateField(StatementAggregator.SCORE);
		expect(aggregator.aggregate(statements)).toEqual(200);

		aggregator.setAggregateType(StatementAggregator.AVG);
		aggregator.setAggregateField(StatementAggregator.SCORE);
		expect(aggregator.aggregate(statements)).toEqual(161.5);

		aggregator.setAggregateType(StatementAggregator.MIN);
		aggregator.setAggregateField(StatementAggregator.TIMESTAMP);
		expect(aggregator.aggregate(statements)).toEqual("2014-08-13T10:45:32.000Z");

		aggregator.setAggregateType(StatementAggregator.MAX);
		aggregator.setAggregateField(StatementAggregator.TIMESTAMP);
		expect(aggregator.aggregate(statements)).toEqual("2014-08-13T10:55:32.000Z");

		aggregator.setAggregateType(StatementAggregator.MIN);
		expect(aggregator.aggregate(statements)).toEqual("2014-08-13T10:45:32.000Z");
	});
});