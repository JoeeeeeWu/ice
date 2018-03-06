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
}
