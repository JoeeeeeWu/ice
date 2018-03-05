import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import R from 'ramda';

import config from '../config';

const models = path.resolve(__dirname, '../database/schema');

fs.readdirSync(models)
  .filter(file => ~file.search(/^[^\.].*js$/))
  .forEach(file => require(path.resolve(models, file)));

const formatData = R.map((i) => {
  i._id = i.nmId;
  return i;
});

let wikiCharacters = require(path.resolve(__dirname, '../database/json/finalCharacters.json'));
let wikiHouses = require(path.resolve(__dirname, '../database/json/completeHouses.json'));

wikiCharacters = formatData(wikiCharacters);

export const database = app => {
  mongoose.set('debug', true);
  mongoose.connect(config.db);
  mongoose.connection.on('disconnected', () => {
    mongoose.connect(config.db);
  });
  mongoose.connection.on('error', err => console.log(err));

  mongoose.connection.on('open', async () => {
    console.log('connected to mongodb', config.db);

    const WikiHouse = mongoose.model('WikiHouse');
    const WikiCharacter = mongoose.model('WikiCharacter');

    const existWikiHouses = await WikiHouse.find({}).exec();
    const existWikiCharacters = await WikiCharacter.find({}).exec();

    if (!existWikiHouses.length) WikiHouse.insertMany(wikiHouses);
    if (!existWikiCharacters.length) WikiCharacter.insertMany(wikiCharacters);
  });
};
