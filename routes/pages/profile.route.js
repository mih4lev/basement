const { Router } = require(`express`);
const router = new Router();
const fs = require(`fs`);

router.use(`/`, (request, response, next) => {
    const isProfile = true;
    request.data = { ...request.data, isProfile };
    next();
});

router.get(`/`, async (request, response) => {
    const isSavedPhoto = true;
    // profile data
    const userDataJSON = fs.readFileSync(`data-mock/profile.json`);
    const userData = JSON.parse(String(userDataJSON));
    // basement ideas albums
    const albumsDataJSON = fs.readFileSync(`data-mock/ideas-albums.json`);
    const ideasAlbumsData = JSON.parse(String(albumsDataJSON));
    // basement-ideas
    const mockJSON = fs.readFileSync(`data-mock/basement-ideas.json`);
    const ideasData = JSON.parse(String(mockJSON));
    ideasData.ideas.length = 20;
    // return data to template rendering
    const data = { ...request.data, ...ideasData, ...ideasAlbumsData, userData, isSavedPhoto };
    response.render(`pages/profile/profile`, data);
});

router.get(`/saved/:albumID`, async (request, response) => {
    const { params: { albumID: requestedAlbumID }} = request;
    const isSavedPhoto = true;
    // profile data
    const userDataJSON = fs.readFileSync(`data-mock/profile.json`);
    const userData = JSON.parse(String(userDataJSON));
    // basement-ideas
    const mockJSON = fs.readFileSync(`data-mock/basement-ideas.json`);
    const ideasData = JSON.parse(String(mockJSON));
    const filterFunc = ({ albumID }) => Number(albumID) === Number(requestedAlbumID);
    const filterData = ideasData.ideas.filter(filterFunc);
    const isMoreButtonVisible = (filterData.length > 20);
    if (filterData.length > 20) filterData.length = 20;
    // return data to template rendering
    const data = { ...request.data, ideas: filterData, userData, isSavedPhoto, isMoreButtonVisible };
    response.render(`pages/profile/saved`, data);
});

router.get(`/uploaded`, async (request, response) => {
    const isLoadedPhoto = true;
    // profile data
    const userDataJSON = fs.readFileSync(`data-mock/profile.json`);
    const userData = JSON.parse(String(userDataJSON));
    // basement-ideas
    const mockJSON = fs.readFileSync(`data-mock/basement-ideas.json`);
    const ideas = JSON.parse(String(mockJSON));
    // return data to template rendering
    const data = { ...request.data, ...ideas, userData, isLoadedPhoto };
    response.render(`pages/profile/uploaded`, data);
});

module.exports = router;