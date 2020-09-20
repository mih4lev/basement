const setRequest = (request, response, next) => {
    request.data = {};
    next();
};

module.exports = setRequest;