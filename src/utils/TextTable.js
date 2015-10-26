/**
 * Show a table in text mode.
 * @class TextTable
 */
function TextTable() {}

/**
 * Do a divider.
 */
TextTable.divider = function(colWidths) {
	var s = "+";

	for (var colIndex = 0; colIndex < colWidths.length; colIndex++)
		s += new Array(colWidths[colIndex] + 3).join("-") + "+";

	return s;
}

/**
 * Render the table
 * @method render
 * @static
 */
TextTable.render = function(data) {
	var colWidths = [];

	for (var rowIndex = 0; rowIndex < data.length; rowIndex++) {
		for (var colIndex = 0; colIndex < data[rowIndex].length; colIndex++) {
			if (!colWidths[colIndex])
				colWidths[colIndex] = 0;

			var cell = new String(data[rowIndex][colIndex]);
			colWidths[colIndex] = Math.max(colWidths[colIndex], cell.length);
		}
	}

	console.log(TextTable.divider(colWidths));

	for (var rowIndex = 0; rowIndex < data.length; rowIndex++) {
		var s = "|";
		for (var colIndex = 0; colIndex < data[rowIndex].length; colIndex++) {
			s += " ";

			var cell = new String(data[rowIndex][colIndex]);
			s += cell;
			s += new Array(colWidths[colIndex] - cell.length + 1).join(" ");
			s += " |";
		}

		console.log(s);

		if (!rowIndex)
			console.log(TextTable.divider(colWidths));
	}

	console.log(TextTable.divider(colWidths));
}

module.exports = TextTable;