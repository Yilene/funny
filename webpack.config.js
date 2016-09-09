var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var autoprefixer = require('autoprefixer');

module.exports = {
    entry: './src/entry.js', //演示单入口文件
    output: {
        filename: 'bundle.js',
        path: __dirname + '/dist'
    },
    module: {
        loaders: [
            {
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('style','css!sass!postcss')
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel"
            },
            {
                test: /\.(jpg|png)$/,
                loader: "url?limit=8192"
            }
        ]
    },
    postcss: function () {
        return [autoprefixer({browsers: ['last 2 versions','> 1%']})];
    },
    plugins: [
        new ExtractTextPlugin("style.css", {allChunks: true})
    ]
};