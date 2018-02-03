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
});

require('babel-polyfill');

require('./server');
