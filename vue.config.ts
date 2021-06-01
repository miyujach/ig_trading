const webpack = require('webpack');
const path = require('path');


module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: '',
  indexPath: 'index.html', // relative to outputDir path
  filenameHashing: true,
  pages: undefined,
  lintOnSave: process.env.NODE_ENV !== 'production',
  runtimeCompiler: false,
  transpileDependencies: [],
  productionSourceMap: true,
  crossorigin: undefined,
  integrity: false,

  configureWebpack: {  
    amd: {
      toUrlUndefined: true,
    },
    resolve: {
      alias: {
        vue$: 'vue/dist/vue.esm.js',
        '@': path.resolve('src'),
      },
    },
    module: {
      rules: [
        {
          test: /\.(pdf|jpg|png|jpe?g|gif)$/i,
          use: [
            {
              loader: 'file-loader',
            },
          ],
        },
      ],
    },
  },
  devServer: {
    port: 4546,
    proxy: 'http://localhost:8080',
    hot: true,
    https: false,
    watchOptions: {
      poll: true
    },
  }

};