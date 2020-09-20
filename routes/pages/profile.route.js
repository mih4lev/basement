const { Router } = require(`express`);
const router = new Router();

const { requestContent } = require("../../models/utils.model");
const { requestUser } = require("../../models/users.model");
const { requestUserAlbums } = require("../../models/albums.model");
const { requestUserIdeas, requestUploadIdeas, requestAlbumIdeas } = require("../../models/ideas.model");

router.use(async (request, response, next) => {
    request.data['isAdaptiveHeader'] = false;
    request.data['scripts'] = ['profile'];
    const userID = request.data['userID'];
    const content = requestContent(await Promise.all([
        requestUser(userID)
    ]));
    request.data = { ...request.data, ...content };
    next();
});

router.get(`/`, async (request, response) => {
    if (!request.data['userID']) return response.status(401).redirect(`/`);
    request.data['isSavedIdeas'] = true;
    request.data['isAlbumsVisible'] = true;
    const userID = request.data['userID'];
    const content = requestContent(await Promise.all([
        requestUserAlbums(userID),
        requestUserIdeas(userID)
    ]));
    const data = { ...request.data, ...content };
    response.render(`pages/profile/profile`, data);
});

router.get(`/saved/:albumID`, async (request, response) => {
    if (!request.data['userID']) return response.status(401).redirect(`/`);
    const { params: { albumID }} = request;
    request.data['isSavedIdeas'] = true;
    const content = requestContent(await Promise.all([
        requestAlbumIdeas(albumID)
    ]));
    const data = { ...request.data, ...content };
    response.render(`pages/profile/profile`, data);
});

router.get(`/uploaded`, async (request, response) => {
    if (!request.data['userID']) return response.status(401).redirect(`/`);
    request.data['isUploadedIdeas'] = true;
    const userID = request.data['userID'];
    const content = requestContent(await Promise.all([
        requestUploadIdeas(userID)
    ]));
    const data = { ...request.data, ...content };
    response.render(`pages/profile/profile`, data);
});

router.get(`/logout`, async (request, response) => {
    if (!request.data['userID']) return response.status(401).redirect(`/`);
    response.cookie('auth_token', { expires: Date.now() }).redirect(`/`);
});

module.exports = router;