var ArrayUtil = require("../utils/ArrayUtil");

/**
 * Aggregate a value from an array of statements
 * according to a specification.
 * @class StatementAggregator
 */
function StatementAggregator() {
	this.aggregateType = StatementAggregator.COUNT;
	this.aggregateField = StatementAggregator.SCORE;
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
 * Get an array of all statement fields.
 */
StatementAggregator.prototype.getStatementFields = function(statements) {
	var res = [];

	for (var i = 0; i < statements.length; i++) {
		var statement = statements[i];
		var val;

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
		}

		res.push(val);
	}

	return res;
}

/**
 * Compute aggregate.
 * @method aggregate
 */
StatementAggregator.prototype.aggregate = function(statements) {
	var values = this.getStatementFields(statements);
	var res;

	switch (this.aggregateType) {
		case StatementAggregator.COUNT:
			return statements.length;
			break;

		case StatementAggregator.MIN:
			if (!values.length)
				return null;

			res = Math.min.apply(null, values);
			break;

		case StatementAggregator.MAX:
			if (!values.length)
				return null;

			res = Math.max.apply(null, values);
			break;

		case StatementAggregator.AVG:
			if (!values.length)
				return null;

			var sum = 0;

			for (var i = 0; i < values.length; i++)
				sum += values[i];

			res = sum / values.length;
			break;
	}

	if (this.aggregateField == StatementAggregator.TIMESTAMP ||
		this.aggregateField == StatementAggregator.STORED)
		return new Date(res).toISOString();

	return res;
}

module.exports = StatementAggregator;