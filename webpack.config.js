var path = require('path');
var webpack = require('webpack');
var autoprefixer = require('autoprefixer');
var precss = require('precss');
var functions = require('postcss-functions');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var postCssLoader = [
  'css-loader?module',
  '&localIdentName=[name]__[local]___[hash:base64:5]',
  '&disableStructuralMinification',
  '!postcss-loader'
];


var plugins = [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new ExtractTextPlugin('bundle.css'),
];

if (process.env.NODE_ENV === 'production') {
  plugins = plugins.concat([
    new webpack.optimize.UglifyJsPlugin({
      output: {comments: false},
      test: /bundle\.js?$/
    }),
    new webpack.DefinePlugin({
      'process.env': {NODE_ENV: JSON.stringify('production')}
    })
  ]);

  postCssLoader.splice(1, 1) // drop human readable names
};

var config = {
	entry: './index.jsx',
	output: {
		path: path.join(__dirname, 'build/static/build'),
		publicPath: "/static/build/",
		filename: '[name].js'
	},
	plugins: plugins,
	module: {
		loaders: [
			{test: /\.css/, loader: ExtractTextPlugin.extract('style-loader', postCssLoader.join(''))},
			{test: /\.(png|gif)$/, loader: 'url-loader?name=[name]@[hash].[ext]&limit=5000'},
			{test: /\.svg$/, loader: 'url-loader?name=[name]@[hash].[ext]&limit=5000!svgo-loader?useConfig=svgo1'},
			{test: /\.(pdf|ico|jpg|eot|otf|woff|ttf|mp4|webm)$/, loader: 'file-loader?name=[name]@[hash].[ext]'},
			{test: /\.json$/, loader: 'json-loader'},
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ['es2015', 'react']
				}
			}
		]
	},
	externals: {
		//don't bundle the 'react' npm package with our bundle.js
        //but get it from a global 'React' variable
        'react': 'React'
    },
	resolve: {
		extensions: ['', '.js', '.jsx', '.css'],
	}
}

module.exports = config;
