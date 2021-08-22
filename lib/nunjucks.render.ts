import * as path from 'path';
import * as nunjucks from 'nunjucks';
const views = path.join(__dirname + '/../../views/templates');
nunjucks.configure(views, { autoescape: true });

export const renderTemplate = (templateName: string, mailData = {}) => {
  return new Promise<string | null>((resolve, reject) => {
    return nunjucks.render(templateName, mailData, (error, template) => {
      if (error !== null) return reject(error);
      return resolve(template);
    });
  });
};
