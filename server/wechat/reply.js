export default async (ctx, next) => {
  const message = ctx.weixin;
  if (message.MsgType === 'text') {
    ctx.body = message.Content;
  } else if (message.MsgType === 'image') {
    ctx.body = {
      type: 'image',
      mediaId: message.MediaId,
    };
  } else if (message.MsgType === 'voice') {
    ctx.body = {
      type: 'voice',
      mediaId: message.MediaId,
    };
  } else if (message.MsgType === 'video') {
    ctx.body = {
      title: message.ThumbMediaId,
      type: 'voice',
      mediaId: message.MediaId,
    };
  } else if (message.MsgType === 'location') {
    ctx.body = `${message.Location_X}:${message.Location_Y}`;
  } else if (message.link === 'link') {
    ctx.body = message.Title;
  }
};
