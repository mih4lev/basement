const { CORS } = process.env;

const allowedOrigins = [ CORS, `http://192.168.1.67:8888` ];
const corsOptions = {
    origin: function(origin, callback){
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            // exit if hostname not allowed
            return callback(new Error(`Not allowed by CORS!`));
        }
        return callback(null, true);
    },
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
    credentials: true,
};

module.exports = corsOptions;