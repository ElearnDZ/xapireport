var fs = require("fs");
var TinCan = require("tincanjs");
var Thenable = require("tinp");
var ArrayUtil = require("../utils/ArrayUtil");
var XapiReportColumn = require("./XapiReportColumn");
var TextTable = require("../utils/TextTable");
/**
 * xAPI Report.
 */
function XapiReport() {}

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
}

/**
 * Run.
 * @method run.
 */
XapiReport.prototype.run = function() {
	this.runThenable = new Thenable();
	this.tinCan.getStatements({
		params: {},
		callback: this.onGetStatements.bind(this)
	});

	return this.runThenable;
}

/**
 * On get statement.
 * @method onGetStatements
 */
XapiReport.prototype.onGetStatements = function(err, result) {
	if (err) {
		this.runThenable.reject(err);
		return;
	}

	this.processStatements(result.statements);

	TextTable.render(this.data);

	this.runThenable.resolve();
}

/**
 * Process statements.
 * @method processStatements
 */
XapiReport.prototype.processStatements = function(statements) {
	this.actors = [];

	for (var i = 0; i < statements.length; i++) {
		var statement = statements[i];
		var email = statement.actor.mbox;

		if (!ArrayUtil.contains(this.actors, email))
			this.actors.push(email);
	}

	//console.log(this.actors);
	this.data = [];

	var row = [];
	row.push("Actor");
	for (var i = 0; i < this.columns.length; i++)
		row.push(this.columns[i].getTitle());

	this.data.push(row);

	for (var actorIndex = 0; actorIndex < this.actors.length; actorIndex++) {
		var row = [];
		var actor = this.actors[actorIndex];
		row.push(actor.replace("mailto:", ""));

		for (var columnIndex = 0; columnIndex < this.columns.length; columnIndex++) {
			var column = this.columns[columnIndex];
			var value = column.getCellValue(actor, statements);
			row.push(value);
		}

		this.data.push(row);
	}
}

/**
 * Get csv string.
 * @method getCsvString
 */
XapiReport.prototype.getCsvString = function() {
	return CsvHack.stringify(this.data);
}

module.exports = XapiReport;