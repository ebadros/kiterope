var path = require("path");
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');


module.exports = {

  context: __dirname,

  entry: './assets/js/index', // entry point of our app. assets/js/index.js should require other js modules and dependencies it needs

  output: {
      path: path.resolve('./assets/bundles/'),
      filename: "[name]-[hash].js",
  },


  plugins: [
    new BundleTracker({filename: './webpack-stats.json'}),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      'window.$':'jquery',
    })
  ],

  module: {
    loaders: [
      { test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query:
      {
        presets:['react','es2015',  'stage-2'],
        plugins: ["transform-decorators-legacy", "transform-class-properties", ]

      }},
      { test: /\.css$/, loader: "style-loader!css-loader" },
        {test: /\.json$/, loader: 'json-loader'}
// to transform JSX into JS
    ],
  },

  externals: {
  },

  resolve: {
    modulesDirectories: ['node_modules', 'bower_components', ],
    extensions: ['', '.js', '.jsx'],
    fallback: path.join(__dirname, "node_modules"),
    alias: {
      react: path.resolve('./node_modules/react'),
      'react/lib/ReactMount': 'react-dom/lib/ReactMount' }

  },

  resolveLoader: { fallback: path.join(__dirname, "node_modules") }

};
WEBPACK_LOADER = {
    'DEFAULT': {
        'STATS_FILE': path.join(__dirname, 'webpack-stats.json')
    }
};