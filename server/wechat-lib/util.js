import xml2js from 'xml2js';
import sha1 from 'sha1';
import template from './tpl';

function parseXML(xml) {
  return new Promise((resolve, reject) => {
    xml2js.parseString(xml, {
      trim: true,
    }, (err, content) => {
      if (err) reject(err);
      else resolve(content);
    });
  });
}

function formatMessage(result) {
  const message = {};
  if (typeof result === 'object') {
    const keys = Object.keys(result);
    for (let i = 0; i < keys.length; i++) {
      const item = result[keys[i]];
      const key = keys[i];
      if (!(item instanceof Array) || item.length === 0) {
        continue;
      }
      if (item.length === 1) {
        const val = item[0];
        if (typeof val === 'object') {
          message[key] = formatMessage(val);
        } else {
          message[key] = (val || '').trim();
        }
      } else {
        message[key] = [];
        for (let j = 0; j < item.length; j++) {
          message[key].push(formatMessage(item[j]));
        }
      }
    }
  }
  return message;
}

function tpl(content, message) {
  let type = 'text';
  if (Array.isArray(content)) {
    type = 'news';
  }
  if (!content) {
    content = '默认回复内容';
  }
  if (content && content.type) {
    type = content.type;
  }
  let info = Object.assign({}, {
    content,
    creatTime: new Date().getTime(),
    msgType: type,
    toUserName: message.FromUserName,
    fromUserName: message.ToUserName,
  });
  return template(info);
}

function raw(args) {
  let keys = Object.keys(args);
  const newArgs = {};
  let str = '';

  keys = keys.sort();
  keys.forEach((key) => {
    newArgs[key.toLowerCase()] = args[key]
  });

  for (let k in newArgs) {
    str += `&${k}=${newArgs[k]}`;
  }

  return str.substr(1);
}

function signIt(nonce, ticket, timestamp, url) {
  const ret = {
    jsapi_ticket: ticket,
    nonceStr: nonce,
    timestamp,
    url,
  };
  const string = raw(ret);
  const sha = sha1(string);
  return sha;
}

function createNonce() {
  return Math.random().toString(36).substr(2, 15);
}

function createTimestamp() {
  return `${parseInt(new Date().getTime() / 1000, 0)} `;
}

function sign(ticket, url) {
  const noncestr = createNonce();
  const timestamp = createTimestamp();
  const signature = signIt(noncestr, ticket, timestamp, url);
  return {
    noncestr,
    timestamp,
    signature,
  };
}

export {
  formatMessage,
  parseXML,
  tpl,
  sign,
};
