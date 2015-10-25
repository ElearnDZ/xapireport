var StatementFilter = require("./StatementFilter");
var StatementAggregator = require("./StatementAggregator");
var ArrayUtil = require("../utils/ArrayUtil");

/**
 * @class XapiReportColumn
 */
function XapiReportColumn(title) {
	this.title = title;
	this.filter = new StatementFilter();
	this.aggregator = new StatementAggregator();
}

/**
 * Parse config.
 * @method parseConfig
 */
XapiReportColumn.prototype.parseConfig = function(config) {
	for (key in config) {
		value = config[key];

		switch (key) {
			case "verbId":
				this.filter.setVerbId(value);
				break;

			case "objectId":
				this.filter.setObjectId(value);
				break;

			case "minScore":
				this.filter.setMinScore(value);
				break;

			case "maxScore":
				this.filter.setMaxScore(value);
				break;

			case "aggregateType":
				this.aggregator.setAggregateType(value);
				break;

			case "aggregateField":
				this.aggregator.setAggregateField(value);
				break;

			case "title":
				this.title = value;
				break;

			default:
				throw new Error("Unexpected column option: " + key);
		}

	}
}

/**
 * Get cell value based on email and data.
 * @method getCellValue
 */
XapiReportColumn.prototype.getCellValue = function(actorEmail, statements) {
	this.filter.setActorEmail(actorEmail);

	var filteredStatements = this.filter.filterStatements(statements);
	var value = this.aggregator.aggregate(filteredStatements);

	return value;
}

/**
 * Get title.
 * @method getTitle
 */
XapiReportColumn.prototype.getTitle=function() {
	return this.title;
}

module.exports = XapiReportColumn;