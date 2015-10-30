var ArrayUtil = require("../utils/ArrayUtil");
var moment = require("moment");

/**
 * Aggregate a value from an array of statements
 * according to a specification.
 * @class StatementAggregator
 */
function StatementAggregator() {
	this.aggregateType = StatementAggregator.COUNT;
	this.aggregateField = StatementAggregator.SCORE;

	this.mapValues = {};
	this.valueCount = {};

	this.dateFormat = null;
}

StatementAggregator.COUNT = "count";
StatementAggregator.MIN = "min";
StatementAggregator.MAX = "max";
StatementAggregator.AVG = "avg";

StatementAggregator.SCORE = "score";
StatementAggregator.TIMESTAMP = "timestamp";
StatementAggregator.STORED = "stored";

/**
 * Set aggregate type.
 * @method setAggregateType
 */
StatementAggregator.prototype.setAggregateType = function(aggregateType) {
	if (!ArrayUtil.contains([
			StatementAggregator.COUNT,
			StatementAggregator.MIN,
			StatementAggregator.MAX,
			StatementAggregator.AVG
		], aggregateType))
		throw new Error("Unknown aggregate type: " + aggregateType);

	this.aggregateType = aggregateType;
}

/**
 * Set aggregate field.
 * @method setAggregateField
 */
StatementAggregator.prototype.setAggregateField = function(aggregateField) {
	if (!ArrayUtil.contains([
			StatementAggregator.SCORE,
			StatementAggregator.TIMESTAMP,
			StatementAggregator.STORED
		], aggregateField))
		throw new Error("Unknown aggregate field: " + aggregateField);

	this.aggregateField = aggregateField;
}

/**
 * Get the value to use from the statement.
 * @method getStatementValue
 */
StatementAggregator.prototype.getStatementValue = function(statement) {
	switch (this.aggregateField) {
		case StatementAggregator.SCORE:
			val = statement.result.score.raw;
			break;

		case StatementAggregator.TIMESTAMP:
			val = Date.parse(statement.timestamp);
			break;

		case StatementAggregator.STORED:
			val = Date.parse(statement.stored);
			break;

		default:
			throw new Error("unknown aggregate field: " + this.aggregateField);
			break;
	}

	return val;
}

/**
 * Map a value.
 * @mehtod mapValueForActorId
 */
StatementAggregator.prototype.mapValueForActorId = function(actorId, value) {
	if (this.valueCount[actorId] == undefined)
		this.valueCount[actorId] = 0;

	this.valueCount[actorId]++;

	switch (this.aggregateType) {
		case StatementAggregator.COUNT:
			if (this.mapValues[actorId] == undefined)
				this.mapValues[actorId] = 0;

			this.mapValues[actorId]++;
			break;

		case StatementAggregator.MIN:
			if (this.mapValues[actorId] == undefined)
				this.mapValues[actorId] = value;

			else
				this.mapValues[actorId] = Math.min(this.mapValues[actorId], value);

			break;

		case StatementAggregator.MAX:
			if (this.mapValues[actorId] == undefined)
				this.mapValues[actorId] = value;

			else
				this.mapValues[actorId] = Math.max(this.mapValues[actorId], value);

			break;

		case StatementAggregator.AVG:
			if (this.mapValues[actorId] == undefined)
				this.mapValues[actorId] = 0;

			this.mapValues[actorId] += value;
			break;
	}
}

/**
 * Process a statement.
 * @method processStatement
 */
StatementAggregator.prototype.processStatement = function(statement) {
	var actorId = statement.actor.mbox;
	actorId = actorId.replace("mailto:", "");

	var value = this.getStatementValue(statement);
	this.mapValueForActorId(actorId, value);
}

/**
 * Set date format
 * @method setDateFormat
 */
StatementAggregator.prototype.setDateFormat = function(dateFormat) {
	this.dateFormat = dateFormat;
}

/**
 * Get aggregated value.
 * @method getAggregatedValue
 */
StatementAggregator.prototype.getAggregatedValue = function(actorId) {
	actorId = actorId.replace("mailto:", "");

	if (this.mapValues[actorId] == undefined) {
		if (this.aggregateType == StatementAggregator.COUNT)
			return 0;

		else
			return null;
	}

	var raw;

	switch (this.aggregateType) {
		case StatementAggregator.COUNT:
			return this.mapValues[actorId];
			break;

		case StatementAggregator.MIN:
		case StatementAggregator.MAX:
			raw = this.mapValues[actorId];
			break;

		case StatementAggregator.AVG:
			raw = this.mapValues[actorId] / this.valueCount[actorId];
			break;
	}

	if (this.aggregateField == StatementAggregator.TIMESTAMP ||
		this.aggregateField == StatementAggregator.STORED) {
		if (!this.dateFormat)
			return new Date(raw).toISOString();

		return moment(new Date(raw)).format(this.dateFormat);
	}

	return raw;
}

module.exports = StatementAggregator;