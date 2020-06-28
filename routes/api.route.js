const cors = require(`cors`);
const corsOptions = require("../middlewares/cors.middleware");

const createAPIRoutes = (app) => {

    const routes = [
        { URL: `/api/ideas`, route: `ideas.api.route` },
        { URL: `/api/profile`, route: `profile.api.route` },
    ];

    routes.forEach((routeData) => {
        app.use(routeData.URL, cors(corsOptions), require(`./api/${routeData.route}`));
    });

};

module.exports = createAPIRoutes;