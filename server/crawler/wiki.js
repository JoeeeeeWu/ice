import cheerio from 'cheerio';
import rp from 'request-promise';
import R from 'ramda';

import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import randomToken from 'random-token';

const sleep = time => new Promise(resolve => setTimeout(resolve, time));

const HOUSES = [
  {
    name: 'House Stark of Winterfell',
    cname: '史塔克家族',
    words: 'Winter is Coming',
  },
  {
    name: 'House Targaryen',
    cname: '坦格利安家族',
    words: 'Fire and Blood',
  },
  {
    name: 'House Lannister of Casterly Rock',
    cname: '兰尼斯特家族',
    words: 'Hear Me Roar!',
  },
  {
    name: 'House Arryn of the Eyrie',
    cname: '艾林家族',
    words: 'As High as Honor',
  },
  {
    name: 'House Tully of the Riverrun',
    cname: '徒利家族',
    words: 'Family, Duty, Honor',
  },
  {
    name: 'House Greyjoy of Pyke',
    cname: '葛雷乔伊家族',
    words: 'We Do Not Sow',
  },
  {
    name: "House Baratheon of Storm's End",
    cname: '风息堡的拜拉席恩家族',
    words: 'Ours is the Fury',
  },
  {
    name: 'House Tyrell of Highgarden',
    cname: '提利尔家族',
    words: 'Growing Strong',
  },
  {
    name: 'House Nymeros Martell of Sunspear',
    cname: '马泰尔家族',
    words: 'Unbowed, Unbent, Unbroken',
  },
];

const normalizedContent = content => _.reduce(content, (acc, item) => {
  if (item.text) acc.push(item.text);

  if (item.elements && item.elements.length) {
    let _acc = normalizedContent(item.elements);
    acc = R.concat(acc, _acc);
  }
  return acc;
}, []);

const normalizedSections = R.compose(
  R.nth(1),
  R.splitAt(1),
  R.map(i => ({
    level: i.level,
    title: i.title,
    content: normalizedContent(i.content),
  })),
);

const getWikiId = async (item) => {
  const query = item.cname || item.name;
  const url = `http://zh.asoiaf.wikia.com/api/v1/Search/List?query=${encodeURI(query)}`;
  let res;
  try {
    res = await rp(url);
  } catch (e) {
    console.log(e);
  }
  res = JSON.parse(res);
  res = res.items[0];
  return R.merge(item, res);
};

const getWikiDetail = async (item) => {
  const {
    id,
  } = item;
  const url = `http://zh.asoiaf.wikia.com/api/v1/Articles/AsSimpleJson?id=${id}`;
  let res;
  try {
    res = await rp(url);
  } catch (e) {
    console.log(e);
  }
  res = JSON.parse(res);
  const getCNameAndIntro = R.compose(
    i => ({
      cname: i.title,
      intro: R.map(R.prop(['text']))(i.content),
    }),
    R.pick(['title', 'content']),
    R.nth(0),
    R.filter(R.propEq('level', 1)),
    R.prop('sections'),
  );

  const getLevel = R.compose(
    R.project(['title', 'content', 'level']),
    R.reject(R.propEq('title', '扩展阅读')),
    R.reject(R.propEq('title', '引用与注释')),
    R.filter(i => i.content.length),
    R.prop('sections'),
  );

  const cnameIntro = getCNameAndIntro(res);
  let sections = getLevel(res);
  const body = R.merge(item, cnameIntro);

  sections = normalizedSections(sections);

  body.sections = sections;
  body.wikiId = id;

  return R.pick([
    'name',
    'cname',
    'playedBy',
    'profile',
    'images',
    'nmId',
    'chId',
    'sections',
    'intro',
    'wikiId',
    'words',
  ], body);
};

// 获取家族数据
const getHouses = async () => {
  let data = R.map(getWikiId, HOUSES);
  data = await Promise.all(data);

  data = R.map(getWikiDetail, data);
  data = await Promise.all(data);

  console.log(data);

  fs.writeFileSync(path.resolve(__dirname, '../database/json/wikiHouses.json'), JSON.stringify(data, null, 2), 'utf8');
};

const getWikiCharacters = async () => {
  let data = require(path.resolve(__dirname, '../database/json/fullCharacters.json'));
  data = R.map(getWikiId, data);
  data = await Promise.all(data);
  console.log('获取 wiki Id');
  console.log(data[0]);

  data = R.map(getWikiDetail, data);
  data = await Promise.all(data);
  console.log('获取 wiki 详细资料');
  console.log(data[0]);

  fs.writeFileSync(path.resolve(__dirname, '../database/json/finalCharacters.json'), JSON.stringify(data, null, 2), 'utf8');
};

const getSwornMembers = () => {
  let houses = require(path.resolve(__dirname, '../database/json/wikiHouses.json'));
  const characters = require(path.resolve(__dirname, '../database/json/finalCharacters.json'));

  const findSwornMembers = R.map(R.compose(
    i => _.reduce(i, (acc, item) => {
      acc = acc.concat(item);
      return acc;
    }, []),

    R.map((i) => {
      const item = R.find(R.propEq('cname', i[0]))(characters);

      return {
        character: item.nmId,
        text: i[1],
      };
    }),

    R.filter(item => R.find(R.propEq('cname', item[0]))(characters)),

    R.map((i) => {
      const item = i.split('，');
      const name = item.shift();

      return [name.replace(/(【|】|爵士|一世女王|三世国王|公爵|国王|王后|夫人|公主|王子)/g, ''), item.join('，')];
    }),

    R.nth(1),
    R.splitAt(1),
    R.prop('content'),
    R.nth(0),
    R.filter(i => R.test(/伊耿历三世纪末的/, i.title)),
    R.prop('sections'),
  ));

  const swornMembers = findSwornMembers(houses);

  houses = _.map(houses, (item, index) => {
    item.swornMembers = swornMembers[index];
    return item;
  });

  fs.writeFileSync(path.resolve(__dirname, '../database/json/completeHouses.json'), JSON.stringify(houses, null, 2), 'utf8');
};

// getHouses();
// getWikiCharacters();
getSwornMembers();
