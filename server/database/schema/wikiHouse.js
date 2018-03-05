const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Mixed = Schema.Types.Mixed;

const WikiHouseSchema = new Schema({
  name: String,
  cname: String,
  words: String,
  intro: String,
  cover: String,
  wikiId: Number,
  sections: Mixed,
  swornMembers: [
    {
      character: {
        type: String,
        ref: 'WikiCharacter',
      },
      text: String,
    },
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

WikiHouseSchema.pre('save', function(next) { // eslint-disable-line
  if (this.isNew) {
    this.meta.createdAt = Date.now();
    this.meta.updatedAt = Date.now();
  } else {
    this.meta.updatedAt = Date.now()
  }
});

const WikiHouse = mongoose.model('WikiHouse', WikiHouseSchema);
