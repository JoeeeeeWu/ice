import path from 'path';

import Route from '../decorator/router';

const r = pathName => path.resolve(__dirname, pathName);

export const router = (app) => {
  const apiPath = r('../routes');
  const router = new Route(app, apiPath);
  router.init();
};
