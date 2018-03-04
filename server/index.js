import Koa from 'koa';
import { Nuxt, Builder } from 'nuxt';
import R from 'ramda';
import path from 'path';
// Import and Set Nuxt.js options
const config = require('../nuxt.config.js');

config.dev = !(process.env === 'production');
const r = pathName => path.resolve(__dirname, pathName);
const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 3000;
const MIDDLEWARES = ['database', 'common', 'router'];

class Server {
  constructor() {
    this.app = new Koa();
    this.useMiddleWares()(MIDDLEWARES);
  }

  useMiddleWares() {
    return R.map(R.compose(
      R.map(i => i(this.app)),
      require,
      i => `${r('./middlewares')}/${i}`,
    ));
  }

  async start() {
    // Instantiate nuxt.js
    const nuxt = new Nuxt(config);

    // Build in development
    if (config.dev) {
      const builder = new Builder(nuxt);
      await builder.build();
    }

    this.app.use(async (ctx, next) => {
      await next();
      ctx.status = 200; // koa defaults to 404 when it sees that status is unset
      return new Promise((resolve, reject) => {
        ctx.res.on('close', resolve);
        ctx.res.on('finish', resolve);
        nuxt.render(ctx.req, ctx.res, (promise) => {
          // nuxt.render passes a rejected promise into callback on error.
          promise.then(resolve).catch(reject);
        });
      });
    });

    this.app.listen(port, host);
    console.log(`Server listening on ${host}:${port}`);
  }
}

const app = new Server();

app.start();
