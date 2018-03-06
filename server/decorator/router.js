import Router from 'koa-router';
import glob from 'glob';
import path, { normalize } from 'path';
import _ from 'lodash';
import R from 'ramda';

let routersMap = new Map();
const isArray = v => _.isArray(v) ? v : [v];
const symbolPrefix = Symbol('prefix');

export default class Route {
  constructor(app, apiPath) {
    this.app = app;
    this.apiPath = apiPath;
    this.router = new Router();
  }

  init() {
    glob.sync(path.resolve(this.apiPath, './*.js')).forEach(require);
    for (let [conf, controller] of routersMap) {
      const controllers = isArray(controller);
      let prefixPath = conf.target[symbolPrefix];
      const routerPath = prefixPath + conf.path;
      this.router[conf.method](routerPath, ...controllers);
    }
    this.app.use(this.router.routes());
    this.app.use(this.router.allowedMethods());
  }
}

export const router = conf => (target, key, desc) => {
  routersMap.set({
    target,
    ...conf,
  }, target[key]);
};

export const controller = pathName => target => target.prototype[symbolPrefix] = pathName;

export const get = pathName => router({
  method: 'get',
  path: pathName,
});

export const post = pathName => router({
  method: 'post',
  path: pathName,
});

export const put = pathName => router({
  method: 'put',
  path: pathName,
});

export const del = pathName => router({
  method: 'del',
  path: pathName,
});

const decorate = (args, middleware) => {
  const [target, key, descriptor] = args;

  target[key] = isArray(target[key]);
  target[key].unshift(middleware);

  return descriptor;
}

export const convert = middleware => (...args) => decorate(args, middleware);

export const required = rules => convert(async (ctx, next) => {
  let errors = [];

  const passRules = R.forEachObjIndexed((value, key) => {
    errors = R.filter(i => !R.has(i, ctx.request[key]))(value);
  });

  passRules(rules);

  if (errors.length) ctx.throw(412, `${errors.join(', ')} 参数缺失`);

  await next();
});
