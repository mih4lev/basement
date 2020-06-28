const express = require(`express`);
const compression = require('compression');
const expressHbs = require(`express-handlebars`);
const app = express();
const hbs = require(`hbs`);
const cookieParser = require(`cookie-parser`);
const loginMiddleware = require("./middlewares/login.middleware");
const createPageRoutes = require("./routes/pages.route");
const createAPIRoutes = require("./routes/api.route")

// compress response
app.use(compression());

// handlebars options
app.engine(`hbs`, expressHbs({
    layoutsDir: `views/layouts`,
    defaultLayout: `layout`,
    extname: `hbs`
}));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

// static source path
app.use(`/public`, express.static(__dirname + `/public`));
app.use(`/robots.txt`, express.static(__dirname + `/robots.txt`));
app.use(`/data-mock`, express.static(__dirname + `/data-mock`));

// middleware
app.use(express.json({ extended: true }));
app.use(cookieParser('secretKeyBasementRemodelingDotCom'));
app.use(loginMiddleware);

// pages routes
createPageRoutes(app);

// API routes
createAPIRoutes(app);

// 404
app.use((request, response, next) => {
    const { url } = request;
    console.log(url);
    // if (url.indexOf(`favicon`) !== -1) {
    //     response.status(404);
    //     return next();
    // }
    // response.status(404).redirect(`/404`);
    next();
});

const PORT = process.env.PORT || 8888;
app.listen(PORT);