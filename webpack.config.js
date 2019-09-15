const path = require('path');
const html = require('html-webpack-plugin');

const htmlPlugin = new html({
	template: path.resolve(__dirname) + '/src/index.html',
	filename: 'index.html'
});

module.exports = {
	entry: ['./src/mandala.ts'],
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/
			}
		]
	},
	resolve: {
		extensions: ['.tsx', '.ts']
	},
	output: {
		filename: 'mandala.js',
		path: path.resolve(__dirname) + '/dist'
	},
	mode: 'none',
	plugins: [htmlPlugin]
};
