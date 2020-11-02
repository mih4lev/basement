const { Router } = require(`express`);
const router = new Router();

const { requestContent } = require("../../models/utils.model");
const { requestMeta } = require("../../models/pages.model");
const { requestUser } = require("../../models/users.model");
const { requestAlbumData, requestUserAlbums } = require("../../models/albums.model");
const {
    requestUserIdeas, requestUploadIdeas, requestAlbumIdeas
} = require("../../models/ideas.model");

router.use(async (request, response, next) => {
    request.data['isAdaptiveHeader'] = false;
    request.data['scripts'] = ['profile'];
    const userID = request.data['userID'];
    const pageID = 15;
    const content = requestContent(await Promise.all([
        requestMeta(pageID),
        requestUser(userID)
    ]));
    request.data = { ...request.data, ...content };
    next();
});

router.get(`/`, async (request, response, next) => {
    if (!request.data['userID']) return next();
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

router.get(`/saved/:albumID`, async (request, response, next) => {
    if (!request.data['userID']) return next();
    const { params: { albumID }} = request;
    request.data['isSavedIdeas'] = true;
    request.data['isAlbumPage'] = true;
    const content = requestContent(await Promise.all([
        requestAlbumData(albumID),
        requestAlbumIdeas(albumID)
    ]));
    const data = { ...request.data, ...content };
    console.log(data);
    response.render(`pages/profile/profile`, data);
});

router.get(`/uploaded`, async (request, response, next) => {
    if (!request.data['userID']) return next();
    request.data['isUploadedIdeas'] = true;
    const userID = request.data['userID'];
    const content = requestContent(await Promise.all([
        requestUploadIdeas(userID)
    ]));
    const data = { ...request.data, ...content };
    response.render(`pages/profile/profile`, data);
});

router.get(`/logout`, async (request, response, next) => {
    if (!request.data['userID']) return next();
    response.cookie('auth_token', { expires: Date.now() }).redirect(`/`);
});

module.exports = router;