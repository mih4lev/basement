const checkLogin = (request, response, next) => {
    const isLogin = false;
    request.data = { ...request.data, isLogin };
    next();
};

module.exports = checkLogin;