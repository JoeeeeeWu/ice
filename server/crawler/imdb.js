import cheerio from 'cheerio';
import rp from 'request-promise';
import R from 'ramda';
import fs from 'fs';
import path from 'path';

const sleep = time => new Promise(resolve => setTimeout(resolve, time));

// 获取人物数据
export const getIMDBCharacters = async () => {
  const options = {
    uri: 'http://www.imdb.com/title/tt0944947/fullcredits?ref_=tt_cl_sm#cast',
    transform: body => cheerio.load(body),
  };

  let photos = [];

  const $ = await rp(options);

  $('table.cast_list tr.odd, tr.even').each(function () {
    const nmIdDom = $(this).find('td.itemprop a');
    const nmId = nmIdDom.attr('href');
    const characterDom = $(this).find('td.character a').first();
    const name = characterDom.text();
    const chId = characterDom.attr('href');
    const playedByDom = $(this).find('td.itemprop span.itemprop');
    const playedBy = playedByDom.text();

    photos.push({
      nmId,
      chId,
      name,
      playedBy,
    });
  });

  console.log(`共拿到${photos.length}条数据`);
  const fn = R.compose(
    R.map((photo) => {
      const reg1 = /\/name\/(.*?)\/\?ref/;
      const reg2 = /\/title\/tt0944947\/characters\/(.*?)\?ref/;
      const match1 = photo.nmId.match(reg1) || [];
      const match2 = photo.chId.match(reg2) || [];
      photo.nmId = match1[1];
      photo.chId = match2[1];

      return photo;
    }),
    R.filter(photo => photo.playedBy && photo.name && photo.nmId && photo.chId),
  );

  photos = fn(photos);

  console.log(`清洗后，剩余${photos.length}条数据`);

  fs.writeFileSync(path.resolve(__dirname, '../database/json/imdb.json'), JSON.stringify(photos, null, 2), 'utf8');
};

const fetchIMDbProfile = async (url) => {
  const options = {
    uri: url,
    transform: body => cheerio.load(body),
  };

  const $ = await rp(options);
  const img = $('.titlecharacters-image-grid.media_index_thumb_list img').first();
  let src = img.attr('src');

  if (src) {
    src = src.split('_V1').shift();
    src += '_V1.jpg';
  }

  return src;
};

// 获取头像信息
export const getIMDbProfile = async () => {
  const characters = require(path.resolve(__dirname, '../database/json/wikiCharacters.json'));

  console.log(characters.length);

  for (let i = 0; i < characters.length; i++) {
    if (!characters[i].profile) {
      const url = `http://www.imdb.com/title/tt0944947/characters/${characters[i].nmId}`;
      console.log(`正在爬取${characters[i].name}`);
      const src = await fetchIMDbProfile(url);
      console.log(`已经爬到${src}`);

      characters[i].profile = src;

      fs.writeFileSync(path.resolve(__dirname, '../database/json/imdbCharacters.json'), JSON.stringify(characters, null, 2), 'utf8');

      await sleep(500);
    }
  }
};

// 检查头像是否都已经拿到
const checkIMDbProfile = () => {
  const characters = require(path.resolve(__dirname, '../database/json/imdbCharacters.json'));
  const newCharacters = [];

  characters.forEach((item) => {
    if (item.profile) {
      newCharacters.push(item);
    } else {
      console.log(item.name);
    }
  });

  fs.writeFileSync(path.resolve(__dirname, '../database/json/validCharacters.json'), JSON.stringify(newCharacters, null, 2), 'utf8');
};

const fetchIMDbImage = async (url) => {
  const options = {
    uri: url,
    transform: body => cheerio.load(body),
  }

  const $ = await rp(options);
  const images = [];

  $('.titlecharacters-image-grid.media_index_thumb_list img').each(function () {
    let src = $(this).attr('src');

    if (src) {
      src = src.split('_V1').shift();
      src += '_V1.jpg';
      images.push(src);
    }
  });

  return images;
};

// 获取图片
export const getIMDbImages = async () => {
  const characters = require(path.resolve(__dirname, '../database/json/validCharacters.json'));

  for (let i = 0; i < characters.length; i++) {
    if (!characters[i].images) {
      const url = `http://www.imdb.com/title/tt0944947/characters/${characters[i].nmId}`;
      console.log(`正在爬取${characters[i].name}`);
      const images = await fetchIMDbImage(url);
      console.log(`已经爬到${images.length}`);

      characters[i].images = images;

      fs.writeFileSync(path.resolve(__dirname, '../database/json/fullCharacters.json'), JSON.stringify(characters, null, 2), 'utf8');

      await sleep(500);
    }
  }
};

// getIMDBCharacters();
// getIMDbProfile();
// checkIMDbProfile();
// getIMDbImages();
