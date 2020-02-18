const express = require(`express`);
const compression = require('compression');
const expressHbs = require(`express-handlebars`);
const hbs = require(`hbs`);
const cookieParser = require(`cookie-parser`);
const cors = require(`cors`);
const corsOptions = require("./middlewares/cors.middleware");
const app = express();
// compress response
app.use(compression());
// handlebars options
app.engine(`hbs`, expressHbs({
    layoutsDir: `views/layouts`,
    defaultLayout: `layout`,
    extname: `hbs`
}));
app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/components');
// static source path
app.use(`/public`, express.static(__dirname + `/public`));
// middleware
app.use(express.json({ extended: true }));
app.use(cookieParser('secretKeyBasementRemodelingDotCom'));
app.use('/api', cors(corsOptions));
app.use('/', require('./routes/home.route'));
// 404
app.use((request, response, next) => {
    const { url } = request;
    if (url.indexOf(`favicon`) !== -1) {
        response.status(404);
        return next();
    }
    response.status(404).redirect(`/404`);
    next();
});
// end
const PORT = process.env.PORT || 8888;
app.listen(PORT);