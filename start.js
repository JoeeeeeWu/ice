const path = require('path');
const r = _path => path.resolve(__dirname, _path);

require('babel-core/register')({
  presets: [
    'stage-0',
    [
      'latest-node',
      {
        target: 'current',
      },
    ],
  ],
  plugins: [
    'transform-decorators-legacy',
    [
      'module-alias',
      [
        {
          src: r('./server'),
          expose: '~',
        },
        {
          src: r('./server/database'),
          expose: 'database',
        },
      ],
    ],
  ],
});

require('babel-polyfill');

require('./server');

// require('./server/crawler/imdb');

// require('./server/crawler/api');

// require('./server/crawler/check');

// require('./server/crawler/wiki');
