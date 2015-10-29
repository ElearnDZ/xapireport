var StringUtil = require("../../src/utils/StringUtil");

describe("StringUtil", function() {
	it("can connect two string", function() {
		var a = "/repo/learninglocker/public/data/xAPI/";
		var b = "/data/xAPI/statements?limit=4&offset=4";

		expect(StringUtil.left(b, 6)).toEqual("/data/");
		expect(StringUtil.right(a, 8)).toEqual("ta/xAPI/");

		s = StringUtil.connect(a, b);
		console.log(s);

		expect(s).toEqual("/repo/learninglocker/public/data/xAPI/statements?limit=4&offset=4");
	});
});