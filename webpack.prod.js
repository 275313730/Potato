const path = require('path');

module.exports = {
  entry: {
    Potato: './dev/Demo.js'
  },
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'dist')
  }
};