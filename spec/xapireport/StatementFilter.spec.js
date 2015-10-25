var TinCan = require("tincanjs");
var statementData = require("../data/statementdata.json");
var StatementFilter = require("../../src/xapireport/StatementFilter");

describe("StatementFilter", function() {
	it("can check if a statement matches", function() {

		var statement = new TinCan.Statement.fromJSON(JSON.stringify(statementData[0]));
		var filter = new StatementFilter();

		expect(filter.matches(statement)).toEqual(true);

		filter.setActorEmail("hello@test.com")
		expect(filter.matches(statement)).toEqual(false);

		filter.setActorEmail("bob@example.com")
		expect(filter.matches(statement)).toEqual(true);

		filter.setActorEmail();

		filter.setObjectId("http://www.example.com/no.ktouch.xml#2")
		expect(filter.matches(statement)).toEqual(false);

		filter.setObjectId("http://www.example.com/no.ktouch.xml#1")
		expect(filter.matches(statement)).toEqual(true);

		filter.setMinScore(200);
		expect(filter.matches(statement)).toEqual(false);

		filter.setMinScore();
		filter.setMaxScore(100);
		expect(filter.matches(statement)).toEqual(false);

		filter.setMaxScore();
		expect(filter.matches(statement)).toEqual(true);

		filter.setVerbId("bla")
		expect(filter.matches(statement)).toEqual(false);

		filter.setVerbId("http://adlnet.gov/expapi/verbs/experienced");
		expect(filter.matches(statement)).toEqual(true);
	});

	it("can filter a set of statements", function() {
		var statements = [];
		statements.push(new TinCan.Statement.fromJSON(JSON.stringify(statementData[0])));
		statements.push(new TinCan.Statement.fromJSON(JSON.stringify(statementData[1])));

		var filter = new StatementFilter();
		expect(filter.filterStatements(statements).length).toEqual(2);

		filter.setMinScore(125);
		expect(filter.filterStatements(statements).length).toEqual(1);
	});
});