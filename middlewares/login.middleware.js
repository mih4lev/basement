const checkLogin = (request, response, next) => {
    console.log(request);
    const isLogin = false;
    request.data = { ...request.data, isLogin };
    next();
};

module.exports = checkLogin;