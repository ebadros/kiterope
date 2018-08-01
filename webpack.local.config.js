var path = require("path");
var webpack = require('webpack');
var BundleTracker = require('webpack-bundle-tracker');


module.exports = {

  context: __dirname,

  entry: ['webpack-dev-server/client?http://localhost:3000',
      'webpack/hot/only-dev-server',
    './assets/js/index',
    ],

  output: {
      path: path.resolve('./assets/bundles/'),
      //filename: "main_bundle.js",

      filename: "[name]-[hash].js",
     publicPath: 'http://localhost:3000/static/bundles/'
  },
  devServer: {
        historyApiFallback: {
            index: '/index.html'
        },
        stats: true,
        inline: true,
        progress: true
    },







  plugins: [
          new webpack.HotModuleReplacementPlugin(),
          new webpack.NoErrorsPlugin(),


    new BundleTracker({filename: './webpack-local-stats.json'}),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      'window.$':'jquery',
    })
  ],
    node: {
   fs: "empty",
    module:"empty",
},


  module: {
      rules: [
    { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader" }
  ],


  //noParse: [/aws\-sdk/],
    loaders: [
      { test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['react-hot','babel-loader',]},
        {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
    },


        //query:
      //{
        //presets:['react','es2015',  'stage-2'],
        //plugins: ["transform-decorators-legacy", "transform-class-properties", ]

      //}},
      { test: /\.css$/, loader: "style-loader!css-loader" },
        {test: /\.json$/, loader: 'json'},

// to transform JSX into JS
    ],
  },

  externals: {
  },

  resolve: {
    modulesDirectories: ['node_modules', 'src','bower_components', ],
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