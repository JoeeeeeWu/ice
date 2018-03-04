import rp from 'request-promise';
import _ from 'lodash';
import path from 'path';
import fs from 'fs';

let characters = [];
let page = 1;

const sleep = time => new Promise(resolve => setTimeout(resolve, time));

const getAPICharacters = async () => {
  const url = `http://www.anapioficeandfire.com/api/characters?page=${page}&pageSize=50`;
  console.log(`正在爬第${page}页数据`);
  let body = await rp(url);
  body = JSON.parse(body);
  console.log(`爬到${body.length}条数据`);
  characters = _.union(characters, body);
  console.log(`现有${characters.length}条数据`);
  if (body.length < 50) {
    console.log('爬完了');
  } else {
    fs.writeFileSync(path.resolve(__dirname, '../database/json/characters.json'), JSON.stringify(characters, null, 2), 'utf8');
    await sleep(1000);
    page++;
    getAPICharacters();
  }
};

export default getAPICharacters;

getAPICharacters();
