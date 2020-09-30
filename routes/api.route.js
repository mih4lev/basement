const cors = require(`cors`);
const corsOptions = require("../middlewares/cors.middleware");

const createAPIRoutes = (app) => {

    const routes = [
        { URL: `/api/ideas`, route: `ideas.api.route` },
        { URL: `/api/portfolio`, route: `portfolio.api.route` },
        { URL: `/api/tips`, route: `tips.api.route` },
        { URL: `/api/testimonials`, route: `testimonials.api.route` },
        { URL: `/api/press`, route: `press.api.route` },
        { URL: `/api/contact`, route: `contact.api.route` },
        { URL: `/api/quote`, route: `quote.api.route` },
        { URL: `/api/offer`, route: `offer.api.route` },
        { URL: `/api/booking`, route: `booking.api.route` },
        { URL: `/api/users`, route: `users.api.route` },
        { URL: `/api/profile/ideas`, route: `profile/ideas.api.route` },
        { URL: `/api/profile/albums`, route: `profile/albums.api.route` },
        { URL: `/api/profile/settings`, route: `profile/settings.api.route` },
        { URL: `/api/profile/calendar`, route: `profile/calendar.api.route` },
    ];

    routes.forEach((routeData) => {
        app.use(routeData.URL, cors(corsOptions), require(`./api/${routeData.route}`));
    });

};

module.exports = createAPIRoutes;