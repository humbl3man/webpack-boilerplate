/* eslint-disable global-require */

const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ExtraneousFileCleanupPlugin = require('webpack-extraneous-file-cleanup-plugin');

const extractSass = new ExtractTextPlugin({
	filename: '[name].css',
	disable: false
});

const nodeEnv = process.env.NODE_ENV || 'production';
const scriptsPath = path.resolve(__dirname, 'src/scripts');
const stylesPath = path.resolve(__dirname, 'src/styles');
const outputPath = path.resolve(__dirname, 'dist');

const entries = {
	'scripts/index': [`${scriptsPath}/index.js`],
	'styles/index': [`${stylesPath}/index.scss`]
};

module.exports = {
	watch: true,
	stats: {
		colors: true,
		cached: false
	},
	devtool: 'sourcemap',
	entry: entries,
	output: {
		filename: '[name].js',
		path: outputPath
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				use: [
					{
						loader: 'babel-loader',
						options: {
							presets: ['env'],
							babelrc: false
						}
					}
				]
			},
			{
				test: /\.css$/,
				use: extractSass.extract({
					use: [
						'css-loader?url=false',
						{
							loader: 'postcss-loader',
							options: {
								plugins: [require('autoprefixer')]
							}
						}
					]
				})
			},
			{
				test: /\.scss$/,
				use: extractSass.extract({
					use: [
						'css-loader',
						{
							loader: 'postcss-loader',
							options: {
								plugins: [require('autoprefixer')]
							}
						},
						'sass-loader'
					]
				})
			},
			{
				test: /\.jpe?g|png|gif/,
				use: [
					{
						loader: 'image-loader'
					}
				]
			}
		]
	},
	plugins: [
		extractSass,
		new ExtraneousFileCleanupPlugin({
			extensions: ['.js'],
			minBytes: 10000,
			paths: ['styles']
		}),
		new webpack.DefinePlugin({
			'process.env': { NODE_ENV: JSON.stringify(nodeEnv) }
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false
			},
			output: {
				comments: false
			},
			sourceMap: true
		})
	],
	externals: {
		jquery: 'jQuery'
	}
};
