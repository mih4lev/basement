const createPageRoutes = (app) => {

    const pages = [
        { URL: `/portfolio`, route: `portfolio.route` },
        { URL: `/basement-ideas`, route: `ideas.route` },
        { URL: `/how-it-works`, route: `how-it-works.route` },
        { URL: `/about-us`, route: `about-us.route` },
        { URL: `/instant-quote`, route: `instant-quote.route` },
        { URL: `/sign-up`, route: `sign-up.route` },
        { URL: `/profile`, route: `profile.route` },
        { URL: `/instagram`, route: `instagram.route` },
        { URL: `/thank-you`, route: `thank-you.route` },
        { URL: `/book`, route: `book.route` },
        { URL: `/`, route: `home.route` }
    ];

    pages.forEach((routeData) => {
        app.use(routeData.URL, require(`./pages/${routeData.route}`));
    });

};

module.exports = createPageRoutes;