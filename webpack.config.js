module.exports = {
    watch: true,
    entry: {
        bundle: `./source/scripts/index.js`
    },
    output: {
        filename: '[name].min.js',
        path: __dirname + '/public/scripts'
    },
    optimization: {
        minimize: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components|temp)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["@babel/preset-env"]
                    }
                }
            }
        ]
    }
};