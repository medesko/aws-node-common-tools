import * as path from 'path';
import * as nunjucks from 'nunjucks';
const views = path.join(__dirname + '/../../views');
nunjucks.configure(views, { autoescape: true });

export const renderTemplate = (path: string, data: any = {}) => {
	return new Promise<string | null>((resolve, reject) => {
		return nunjucks.render(path, data, (error: any, template: string) => {
			if (error !== null) return reject(error);
			return resolve(template);
		});
	});
};
