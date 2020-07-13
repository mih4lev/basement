const { Router } = require(`express`);
const router = new Router();
const fs = require(`fs`);

router.use(`/`, (request, response, next) => {
    const isProfile = true;
    // profile data
    const profileDataJSON = fs.readFileSync(`data-mock/profile.json`);
    const profileData = JSON.parse(String(profileDataJSON));
    //
    request.data = { ...request.data, isProfile, profileData };
    next();
});

router.get(`/`, async (request, response) => {
    const options = { isSavedIdeas: true, isAlbumsVisible: true };
    // basement ideas albums
    const albumsDataJSON = fs.readFileSync(`data-mock/ideas-albums.json`);
    const ideasAlbumsData = JSON.parse(String(albumsDataJSON));
    // basement-ideas
    const ideasMockJSON = fs.readFileSync(`data-mock/basement-ideas.json`);
    const ideasData = JSON.parse(String(ideasMockJSON));
    ideasData.ideas.length = 20;
    // return data to template rendering
    const data = { ...request.data, ...ideasData, ...ideasAlbumsData, ...options };
    response.render(`pages/profile/profile`, data);
});

router.get(`/saved/:albumID`, async (request, response) => {
    const { params: { albumID: requestedAlbumID }} = request;
    const options = { isSavedIdeas: true };
    // basement-ideas
    const mockJSON = fs.readFileSync(`data-mock/basement-ideas.json`);
    const ideasData = JSON.parse(String(mockJSON));
    const filterFunc = ({ albumID }) => Number(albumID) === Number(requestedAlbumID);
    const filterData = ideasData.ideas.filter(filterFunc);
    const isMoreButtonVisible = (filterData.length > 20);
    if (filterData.length > 20) filterData.length = 20;
    // return data to template rendering
    const data = { ...request.data, ideas: filterData, ...options, isMoreButtonVisible };
    response.render(`pages/profile/profile`, data);
});

router.get(`/uploaded`, async (request, response) => {
    console.log(request.data);
    const options = { isUploadedIdeas: true };
    // basement-ideas
    const ideasMockJSON = fs.readFileSync(`data-mock/uploaded-ideas.json`);
    const ideasData = JSON.parse(String(ideasMockJSON));
    ideasData.ideas.forEach((idea) => idea.author = `By you`);
    // return data to template rendering
    const data = { ...request.data, ...ideasData, ...options };
    response.render(`pages/profile/profile`, data);
});

module.exports = router;