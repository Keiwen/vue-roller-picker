var path = require('path')
var merge = require('webpack-merge')

module.exports = merge.smart(require(path.resolve(__dirname, '../conf/webpack.js')), {
	entry: path.resolve(__dirname, './main.js'),
	devtool: "#eval",

	output: {
		path: path.resolve(__dirname, '../dist'),
		publicPath: path.resolve(__dirname, '../dist'),
		filename: 'vue-roller-picker.js'
	}
})
