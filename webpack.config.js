const filesMap = {
    'layout': `./views/layouts/layout.js`,
    'home': `./views/pages/home/home.main.js`,
    'landing': `./views/pages/landing/landing.main.js`,
    'profile': `./views/pages/profile/profile.main.js`,
    'ideas': `./views/pages/basement-ideas/ideas.main.js`,
    'portfolio': `./views/pages/portfolio/portfolio.main.js`,
    'sign-up': `./views/pages/sign-up/sign-up.main.js`,
    'process': `./views/pages/how-it-works/process/process.main.js`,
    'tips': `./views/pages/how-it-works/blog/blog.main.js`,
    'offers': `./views/pages/about-us/offers/offers.main.js`,
    'testimonials': `./views/pages/about-us/testimonials/testimonials.main.js`,
    'press': `./views/pages/about-us/press/press.main.js`,
    'thank-you': `./views/pages/thank-you/thank-you.main.js`,
    'admin': `./views/admin/admin.js`
};

module.exports = {
    watch: true,
    entry: filesMap,
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