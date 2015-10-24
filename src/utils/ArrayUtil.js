/**
 * Array utilities.
 * @class ArrayUtil
 */
function ArrayUtil() {

}

module.exports = ArrayUtil;

/**
 * Check if a value exists in an array.
 * @method contains
 */
ArrayUtil.contains = function(array, value) {
	return array.indexOf(value) >= 0;
}