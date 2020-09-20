const { requestUser } = require("../models/users.model");
const jwt = require(`jsonwebtoken`);
const { JWTOKEN } = process.env;

const checkLogin = async (request, response, next) => {
    try {
        if (
            !request.cookies['auth_token'] ||
            typeof request.cookies['auth_token'] !== `string`
        ) return next(); // return if wrong auth_token
        const token = await jwt.verify(request.cookies['auth_token'], JWTOKEN);
        const { id: userID } = token;
        if (!userID) return next(); // return if wrong payload || not exist userID
        const userData = await requestUser(userID);
        if (!userData.profile) return next(); // return if deleted user
        request.data['isLogin'] = true;
        request.data['userID'] = userID;
        request.data['isAdmin'] = userData.profile.isAdmin;
        request.data = { ...request.data, ...userData };
        next();
    } catch (error) {
        console.log(error);
        next();
    }
};

module.exports = checkLogin;