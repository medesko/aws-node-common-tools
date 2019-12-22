import * as path from 'path';
import * as nunjucks from 'nunjucks';
const dateFilter = require('nunjucks-date-filter');
const views = path.join(__dirname + '/../views');
console.log(views);
const env = new nunjucks.Environment();
env.addFilter('date', dateFilter);
nunjucks.configure(views, { autoescape: true });

export const renderTemplate = (path: string, data: any = {}) => {
	return new Promise<string | null>((resolve, reject) => {
		return nunjucks.render(path, data, (error: any, template: string) => {
			if (error !== null) return reject(error);
			return resolve(template);
		});
	});
};
