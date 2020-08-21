const path = require('path');

module.exports = {
  entry: {
    Potato: './main.js'
  },
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'dist')
  }
};