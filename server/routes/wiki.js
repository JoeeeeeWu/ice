import api from '../api';

import {
  controller,
  get,
  post,
} from '../decorator/router';


@controller('/wiki')
export class WechatController {
  @get('/houses')
  async getHouses(ctx, next) {
    const data = await api.wiki.getHouses();
    ctx.body = {
      data,
      success: true,
    };
  }

  @get('/houses/:_id')
  async getHouse(ctx, next) {
    const {
      params: {
        _id,
      }
    } = ctx;
    if (!_id) {
      ctx.body = {
        success: false,
        err: '_id is required',
      };
      return;
    }
    const data = await api.wiki.getHouse(_id);
    ctx.body = {
      data,
      success: true,
    };
  }

  @get('/characters')
  async getCharacters(ctx, next) {
    const {
      query: {
        limit = 20,
      },
    } = ctx;
    const data = await api.wiki.getCharacters(limit);
    ctx.body = {
      data,
      success: true,
    };
  }

  @get('/characters/:_id')
  async getCharacter(ctx, next) {
    const {
      params: {
        _id,
      },
    } = ctx;
    if (!_id) {
      ctx.body = {
        success: false,
        err: '_id is required',
      };
      return;
    }
    const data = await api.wiki.getCharacter(_id);
    ctx.body = {
      data,
      success: true,
    };
  }
}
