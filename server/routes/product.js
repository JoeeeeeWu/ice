import R from 'ramda';
import xss from 'xss';
import api from '../api';
import {
  controller,
  get,
  post,
  del,
  put,
} from '../decorator/router';
import * as qiniu from '../libs/qiniu';

@controller('/api')
export default class ProductController {
  @get('/products')
  async getProducts(ctx, next) {
    const {
      limit = 50,
    } = ctx.query;
    const data = await api.product.getProducts(limit);
    ctx.body = {
      data,
      success: true,
    };
  }

  @get('/products/:_id')
  async getProduct(ctx, next) {
    const {
      _id,
    } = ctx.params;
    if (!_id) {
      ctx.body = {
        success: false,
        err: '_id is required',
      };
    } else {
      const data = await api.product.getProduct(_id);
      ctx.body = {
        data,
        success: true,
      };
    }
  }

  @post('/products')
  async postProducts(ctx, next) {
    let {
      body: product,
    } = ctx.request;
    product = {
      title: xss(product.title),
      price: xss(product.price),
      intro: xss(product.intro),
      images: R.map(xss)(product.images),
      parameters: R.map(item => ({
        key: xss(item.key),
        value: xss(item.value),
      }))(product.parameters),
    };
    try {
      product = await api.product.save(product);
      ctx.body = {
        data: product,
        success: true,
      };
    } catch (e) {
      ctx.body = {
        err: e,
        success: false,
      };
    }
  }

  @put('/products')
  async putProduct(ctx, next) {
    const {
      body,
      body: {
        _id,
      },
    } = ctx.request;
    if (!_id) {
      return (
        ctx.body = {
          success: false,
          err: '_id is required',
        }
      );
    }
    let product = await api.product.getProduct(_id);
    if (!product) {
      return (
        ctx.body = {
          success: false,
          err: 'product not exist',
        }
      );
    }
    product.title = xss(body.title);
    product.price = xss(body.price);
    product.intro = xss(body.intro);
    product.images = R.map(xss)(body.images);
    product.parameters = R.map(item => ({
      key: xss(item.key),
      value: xss(item.value),
    }))(body.parameters);
    try {
      product = await api.product.update(product);
      ctx.body = {
        data: product,
        success: true,
      };
    } catch (e) {
      ctx.body = {
        success: false,
        err: e,
      };
    }
  }

  @del('/products/:_id')
  async delProducts(ctx, next) {
    const {
      _id,
    } = ctx.params;
    if (!_id) {
      return (
        ctx.body = {
          success: false,
          err: '_id is required',
        }
      );
    }
    let product = await api.product.getProduct(_id);
    if (!product) {
      return (
        ctx.body = {
          success: false,
          err: 'product not exist',
        }
      );
    }
    try {
      await api.product.del(product);
      ctx.body = {
        success: true,
      };
    } catch (e) {
      ctx.body = {
        success: false,
        err: e,
      };
    }
  }

  @get('/qiniu/token')
  async qiniuToken(ctx, next) {
    const {
      key,
    } = ctx.query;
    const token = qiniu.uptoken(key);
    ctx.body = {
      success: true,
      data: {
        key,
        token,
      },
    };
  }
}
