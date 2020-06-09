const checkLogin = (request, response, next) => {
    const isLogin = true;
    request.data = { ...request.data, isLogin };
    next();
};

module.exports = checkLogin;