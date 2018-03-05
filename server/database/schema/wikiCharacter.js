const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Mixed = Schema.Types.Mixed;

const WikiCharacterSchema = new Schema({
  _id: String,
  wikiId: String,
  nmId: String,
  chId: String,
  name: String,
  cname: String,
  playedBy: String,
  profile: String,
  images: [
    String,
  ],
  sections: Mixed,
  intro: [
    String,
  ],
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

WikiCharacterSchema.pre('save', function(next) { // eslint-disable-line
  if (this.isNew) {
    this.meta.createdAt = Date.now();
    this.meta.updatedAt = Date.now();
  } else {
    this.meta.updatedAt = Date.now();
  }
  next();
});

const WikiCharacter = mongoose.model('WikiCharacter', WikiCharacterSchema);
