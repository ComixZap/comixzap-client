const isProduction = process.env.NODE_ENV == 'production';

module.exports = {
  plugins: {
    'postcss-import': {},
    'postcss-node-sass': { outputStyle: isProduction ? 'compressed' : 'nested' },
    'autoprefixer': {},
  }
}
