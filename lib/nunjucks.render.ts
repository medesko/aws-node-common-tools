import * as nunjucks from 'nunjucks';
const dateFilter = require('nunjucks-date-filter');

const env = new nunjucks.Environment();
env.addFilter('date', dateFilter);
nunjucks.configure('views', { autoescape: true });

export const buildTemplate = (path: string, data: any = {}) => {
	return new Promise<string>((resolve, reject) => {
		return nunjucks.render(path, data, (error: any, template: string) => {
			if (error !== null) {
				return reject(error);
			} else {
				return resolve(template);
			}
		});
	});
};
