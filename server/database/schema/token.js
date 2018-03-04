const mongoose = require('mongoose');

const TokenSchema = new mongoose.Schema({
  name: String,
  token: String,
  expires_in: Number,
  meta: {
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
  },
});

const Token = mongoose.model('Token', TokenSchema);

TokenSchema.pre('save', function (next) { // eslint-disable-line
  if (this.isNew) {
    this.meta.createdAt = Date.now();
    this.meta.updatedAt = Date.now();
  } else {
    this.meta.updatedAt = Date.now();
  }
  next();
});

TokenSchema.statics = {
  async getAccessToken() {
    const token = await this.findOne({
      name: 'access_token',
    }).exec();
    if (token && token.token) {
      token.access_token = token.token;
    }
    return token;
  },

  async saveAccessToken(data) {
    let token = await this.findOne({
      name: 'access_token',
    }).exec();
    if (token) {
      token.token = data.access_token;
      token.expires_in = data.expires_in;
    } else {
      token = new Token({
        name: 'access_token',
        token: data.access_token,
        expires_in: data.expires_in,
      });
    }
    await token.save();
    return data;
  },
};
