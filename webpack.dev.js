const { merge } = require('webpack-merge');
const HtmlWebpackPlugin =  require('html-webpack-plugin');
const path = require("path");
const config = require('./webpack.config.js');
require("regenerator-runtime");               // Import it in all the files using async/await
// const WorkboxPlugin = require('workbox-webpack-plugin');   // For Service Workers


module.exports = merge(config, {
  mode: 'development',

  devtool: 'inline-source-map',

  optimization: {       // Tree shaking
    usedExports: true,
  },
  
  cache: false,

  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 3000,
    hot: true,
    historyApiFallback: true,
    allowedHosts: "all",
  },

  // Uncomment before final deployment.

  plugins: [
    new HtmlWebpackPlugin ({
      title: 'Development',               // For PWA: 'Progressive Wep Application' 
      template : 'public/index.html'
    }),
    // new WorkboxPlugin.GenerateSW({      // For Service Workers
    //   clientsClaim: true,
    //   skipWaiting: true,
    //   maximumFileSizeToCacheInBytes: 5*1024*1024
    // }),
  ]

});
