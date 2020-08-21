const path = require('path');

module.exports = {
  entry: {
    d5c4q8: './dev/main.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dev')
  }
};