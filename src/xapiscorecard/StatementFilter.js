/**
 * Filter statements.
 * @class StatementFilter
 */
function StatementFilter() {}

/**
 * Set actor email to match.
 * @method setActorEmail
 */
StatementFilter.prototype.setActorEmail = function(email) {
	this.actorEmail = email;
}

/**
 * Set actor email to match.
 * @method setActorEmail
 */
StatementFilter.prototype.setObjectId = function(objectId) {
	this.objectId = objectId;
}

/**
 * Set minimum score to match.
 * @method setMinScore
 */
StatementFilter.prototype.setMinScore = function(minScore) {
	this.minScore = minScore;
}

/**
 * Set maximum score to match.
 * @method setMaxScore
 */
StatementFilter.prototype.setMaxScore = function(maxScore) {
	this.maxScore = maxScore;
}

/**
 * Verb id.
 * @method setVerbId
 */
StatementFilter.prototype.setVerbId = function(verbId) {
	this.verbId = verbId;
}

/**
 * Check if a statement matches the filter.
 * @method matches
 */
StatementFilter.prototype.matches = function(statement) {
	if (this.actorEmail && "mailto:" + this.actorEmail != statement.actor.mbox)
		return false;

	if (this.objectId && this.objectId != statement.target.id)
		return false;

	if (this.minScore !== undefined && statement.result.score.raw < this.minScore)
		return false;

	if (this.maxScore !== undefined && statement.result.score.raw > this.maxScore)
		return false;

	if (this.verbId && this.verbId != statement.verb.id)
		return false;

	return true;
}

module.exports = StatementFilter;