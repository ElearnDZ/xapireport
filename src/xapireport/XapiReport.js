var fs = require("fs");
var TinCan = require("tincanjs");
var Thenable = require("tinp");
var ArrayUtil = require("../utils/ArrayUtil");
var XapiReportColumn = require("./XapiReportColumn");
var TextTable = require("../utils/TextTable");
var CsvHack = require("../utils/CsvHack");
var url = require("url");
var StringUtil = require("../utils/StringUtil");

/**
 * xAPI Report.
 */
function XapiReport() {
	this.actors = [];
}

/**
 * Load configuration.
 * @method loadConfig
 */
XapiReport.prototype.loadConfig = function(fn) {
	var content = fs.readFileSync(fn);
	var data = JSON.parse(content);
	this.parseConfig(data);
}

/**
 * Parse config
 * @method parseConfig
 */
XapiReport.prototype.parseConfig = function(config) {
	var knownOptions = [
		"config", "columns", "csv",
		"xapiEndpoint", "xapiUsername", "xapiPassword",
		"limit"
	];

	for (c in config)
		if (!ArrayUtil.contains(knownOptions, c))
			throw new Error("Unknown option: " + c);

	this.tinCan = new TinCan({
		recordStores: [{
			endpoint: config.xapiEndpoint,
			username: config.xapiUsername,
			password: config.xapiPassword,
			allowFail: false
		}]
	});

	this.columns = [];

	for (var i = 0; i < config.columns.length; i++) {
		var column = new XapiReportColumn("Column " + (i + 1));
		column.parseConfig(config.columns[i]);
		this.columns.push(column);
	}

	this.limit = 100;
	if (config.limit)
		this.limit = config.limit;

	this.csv = config.csv;
}

/**
 * Run.
 * @method run.
 */
XapiReport.prototype.run = function() {
	this.runThenable = new Thenable();
	this.tinCan.getStatements({
		params: {
			limit: this.limit
		},
		callback: this.onGetStatements.bind(this)
	});

	this.statementCount = 0;

	return this.runThenable;
}

/**
 * On get statement.
 * @method onGetStatements
 */
XapiReport.prototype.onGetStatements = function(err, result) {
	if (err) {
		console.log(err);
		this.runThenable.reject(err);
		return;
	}

	for (var i = 0; i < result.statements.length; i++)
		this.processStatement(result.statements[i]);

	//console.log("got statements: " + result.statements.length);
	//console.log("more: " + result.more);
	//console.log(this.tinCan.recordStores[0].endpoint);

	this.statementCount += result.statements.length;

	if (result.more) {
		console.log("Fetched " + this.statementCount + " statement(s), more...");

		var endpoint = this.tinCan.recordStores[0].endpoint;
		var parsed = url.parse(endpoint);
		var more = StringUtil.connect(parsed.path, result.more);

		this.tinCan.recordStores[0].moreStatements({
			url: more,
			callback: this.onGetStatements.bind(this)
		});
	} else {
		console.log("Fetched " + this.statementCount + " statement(s), that's all!");

		this.data = this.getData();

		if (this.csv) {
			fs.writeFileSync(this.csv, this.getCsvString());
			console.log("Wrote: " + this.csv);
		} else {
			TextTable.render(this.data);
		}

		this.runThenable.resolve();
	}
}

/**
 * Process statements.
 * @method processStatements
 */
XapiReport.prototype.processStatement = function(statement) {
	var email = statement.actor.mbox;
	email = email.replace("mailto:", "");

	if (!ArrayUtil.contains(this.actors, email))
		this.actors.push(email);

	for (var i = 0; i < this.columns.length; i++)
		this.columns[i].processStatement(statement);
}

/**
 * Get data.
 * @method getData
 */
XapiReport.prototype.getData = function() {
	var data = [];

	var row = [];
	row.push("Actor");
	for (var i = 0; i < this.columns.length; i++)
		row.push(this.columns[i].getTitle());

	data.push(row);

	for (var actorIndex = 0; actorIndex < this.actors.length; actorIndex++) {
		var row = [];
		var actor = this.actors[actorIndex];
		row.push(actor);

		for (var columnIndex = 0; columnIndex < this.columns.length; columnIndex++) {
			var column = this.columns[columnIndex];
			var value = column.getCellValue(actor);
			row.push(value);
		}

		data.push(row);
	}

	return data;
}

/**
 * Get csv string.
 * @method getCsvString
 */
XapiReport.prototype.getCsvString = function() {
	return CsvHack.stringify(this.data);
}

module.exports = XapiReport;