import path from 'path';
import fs from 'fs';
import R from 'ramda';
import _ from 'lodash';

const characters = require(path.resolve(__dirname, '../database/json/characters.json'));
const IMDbData = require(path.resolve(__dirname, '../database/json/imdb.json'));

const findNameInAPI = item => _.find(characters, {
  name: item.name,
});

const findPlayedByInAPI = item => _.find(characters, i => i.playedBy.includes(item.playedBy));

const validData = R.filter(item => findNameInAPI(item) && findPlayedByInAPI(item));

const IMDb = validData(IMDbData);

console.log(`公有${IMDb.length}条数据`);

fs.writeFileSync(path.resolve(__dirname, '../database/json/wikiCharacters.json'), JSON.stringify(IMDb, null, 2), 'utf8');
