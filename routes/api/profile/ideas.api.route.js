const { Router } = require(`express`);
const router = new Router();
const fs = require(`fs`);
const multer = require('multer');
const formParser = multer();

// API /api/profile/ideas/ GET
router.get(`/`, async (request, response) => {
    const ideasMockJSON = fs.readFileSync(`data-mock/saved-ideas.json`);
    const { ideas } = await JSON.parse(ideasMockJSON);
    await response.json(ideas);
});

// API /api/profile/ideas/ POST
router.post(`/`, formParser.none(), async (request, response) => {
    const formData = { ...request.body };
    console.log(formData);
    const data = { code: 200 };
    setTimeout(() => response.json(data), 1000);
});

// API /api/profile/ideas/ DELETE
router.delete(`/`, formParser.none(), async (request, response) => {
    const formData = { ...request.body };
    console.log(formData);
    const data = { code: 200 };
    setTimeout(() => response.json(data), 1000);
});

module.exports = router;