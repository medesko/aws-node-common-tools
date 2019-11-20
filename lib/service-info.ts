import * as path from 'path';
export const { name, version } = require(path.join(
	process.cwd(),
	'package.json'
));
