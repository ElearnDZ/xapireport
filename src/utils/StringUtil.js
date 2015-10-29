/**
 * @class StringUtil
 */
function StringUtil() {}

/**
 * Left part of the string.
 * @method left
 */
StringUtil.left = function(s, n) {
	return s.substr(0, n);
}

/**
 * Right part of the string.
 * @method right
 */
StringUtil.right = function(s, n) {
	return s.substr(-n);
}

/**
 * Connect strings
 * @method connect
 */
StringUtil.connect = function(a, b) {
	var shortest = Math.min(a.length, b.length);
	var overlap = 0;

	for (var i = 0; i < shortest; i++) {
		if (StringUtil.right(a, i) == StringUtil.left(b, i))
			overlap = i;
	}

	return StringUtil.left(a, a.length - overlap) + b;
}

module.exports = StringUtil;