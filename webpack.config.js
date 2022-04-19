const path = require('path')

module.exports = {
  entry: {
    calendar: path.resolve(__dirname, './src/index.js')
  },
  output: {
    path: path.resolve(__dirname, 'F:/www/artflashmagazine.ru/wp-content/themes/artflash/assets_new/js/'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: '/node_modules/',
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  watchOptions: {
    aggregateTimeout: 500,
    poll: 1000 // порверяем изменения раз в секунду
  },
}