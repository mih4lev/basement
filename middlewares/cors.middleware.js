const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5000',
    'http://localhost:8888',
    'http://192.168.1.33:8888',
    'https://brcom.ru',
    'https://basementremodeling.com/'
];
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