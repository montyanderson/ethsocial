const earthly = require("earthly");
const browserify = require("browserify");
const less = require("less");
const fs = require("fs");
const util = require("util");

less.renderAsync = util.promisify(less.render);

earthly.task("browserify", [ "index.js", "lib/*.js" ], async () => {
	const bundle = await earthly.stream(
		browserify("index.js").bundle()
	);

	await earthly.writeFile(__dirname + "/bundle.js", bundle);
});

earthly.task("less", [ "styles/*" ], async () => {
	const indexLess = await util.promisify(fs.readFile)(`${__dirname}/styles/index.less`, "utf8");

	const result = await less.renderAsync(indexLess, {
		paths: [ `${__dirname}/styles/` ],
		filename: "index.less"
	});

	await earthly.writeFile(`${__dirname}/bundle.css`, result.css);
});


earthly.go();
