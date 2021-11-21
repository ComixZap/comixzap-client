const isProduction = process.env.NODE_ENV == 'production';

module.exports = {
  plugins: [
    require('postcss-import'),
    require('postcss-nested'),
    // 'postcss-sass': { outputStyle: isProduction ? 'compressed' : 'nested' },
    require('autoprefixer'),
  ]
}
