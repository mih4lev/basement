require(`dotenv`).config();
const { Router } = require(`express`);
const router = new Router();
const multer = require('multer');
const formParser = multer();
const jwt = require(`jsonwebtoken`);
const fetch = require(`node-fetch`);
const { JWTOKEN } = process.env;
const {
    createUser, requestAuthorize, requestGoogleAuthorize, requestFacebookAuthorize, checkMail
} = require("../../models/users.model");
const { getCryptoPassword, generateSalt } = require("../../models/utils.model");

const session = 1000 * 60 * 60 * 24 * 365; // 365 days login session

// API /api/users/login - POST
router.post(`/login`, formParser.none(), async (request, response) => {
    const formData = { ...request.body };
    if (!formData.mail) return response.json({ status: 0, code: 1401, error: `Empty mail` });
    if (!formData.password) return response.json({ status: 0, code: 1402, error: `Empty password` });
    const defaultError = `Incorrect user data`;
    const { userID, password, salt } = await requestAuthorize(formData.mail);
    if (!userID || !password || !salt) return response.json({ status: 0, code: 1401, error: defaultError });
    const { password: requestPassword } = getCryptoPassword(formData.password, salt);
    if (password !== requestPassword) return response.json({ status: 0, code: 1403, error: defaultError });
    const token = jwt.sign({ id: userID }, JWTOKEN);
    const data = { status: 1 };
    response.cookie(`auth_token`, token, { maxAge: session, httpOnly: true, sameSite: `strict` }).json(data);
});

router.post(`/login/google/:accessToken`, async (request, response) => {
    const { params: { accessToken }} = request;
    const URL = `https://oauth2.googleapis.com/tokeninfo?id_token=${accessToken}`;
    const googleRequest = await fetch(URL);
    const { sub: googleID, email: mail, given_name: name, family_name: surname } = await googleRequest.json();
    let { userID } = await requestGoogleAuthorize(googleID);
    // create new user if not exist
    if (!userID) {
        const userData = { googleID, mail, name, surname };
        const { requestID } = await createUser(userData);
        userID = requestID;
    }
    const token = jwt.sign({ id: userID }, JWTOKEN);
    const data = { status: 1 };
    response.cookie(`auth_token`, token, { maxAge: session, httpOnly: true }).json(data);
});

router.post(`/login/facebook/:accessToken`, async (request, response) => {
    const { params: { accessToken }} = request;
    const fields = [`id`, `first_name`, `last_name`, `email`];
    const URL = `https://graph.facebook.com/me?access_token=${accessToken}&fields=` + fields.join(`,`);
    const facebookRequest = await fetch(URL);
    const { id: facebookID, email: mail, first_name: name, last_name: surname } = await facebookRequest.json();
    let { userID } = await requestFacebookAuthorize(facebookID);
    if (!userID) {
        const userData = { facebookID, mail, name, surname };
        const { requestID } = await createUser(userData);
        userID = requestID;
    }
    const token = jwt.sign({ id: userID }, JWTOKEN);
    const data = { status: 1 };
    response.cookie(`auth_token`, token, { maxAge: session, httpOnly: true }).json(data);
});

// API /api/users/signup - POST
router.post(`/signup`, formParser.none(), async (request, response) => {
    const { password, mail, ...userData } = request.body;
    const { userID } = await checkMail(mail);
    if (userID) {
        const error = `The user with this email address is already registered.`;
        return response.json({ status: 0, error });
    }
    const passwordData = getCryptoPassword(password, generateSalt(16));
    const createData = { ...passwordData, ...userData, mail };
    const data = await createUser(createData);
    const token = jwt.sign({ id: data.requestID }, JWTOKEN);
    response.cookie(`auth_token`, token, { maxAge: session, httpOnly: true }).json(data);
});

module.exports = router;