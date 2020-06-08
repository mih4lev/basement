const { Router } = require(`express`);
const router = new Router();
const fs = require(`fs`);

router.get(`/`, async (request, response) => {
    // basement-ideas
    const mockJSON = fs.readFileSync(`data-mock/basement-ideas.json`);
    const ideas = JSON.parse(mockJSON);
    // return data to template rendering
    const data = { ...request.data, ...ideas };
    response.render(`pages/profile/profile`, data);
});

module.exports = router;