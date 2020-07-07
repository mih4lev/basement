const { Router } = require(`express`);
const router = new Router();
const fs = require(`fs`);
const multer = require('multer');
const ideaUpload = multer({ dest: "public/upload/ideas/" });
const formParser = multer();

// API /api/ideas - POST | add ideas (multiple)
router.post(`/`, ideaUpload.array(`ideaPhotos`), async (request, response) => {
    const formData = { ...request.body, files: request.files};
    console.log(formData);
    const addedIDArray = [ 286, 287, 288, 289, 290 ]; // temp added array
    const data = { code: 200, addedIDArray };
    setTimeout(() => response.json(data), 1000);
});

// API /api/ideas - DELETE | delete ideas (single)
router.delete(`/`, formParser.none(), async (request, response) => {
    const formData = { ...request.body };
    console.log(formData);
    const { ideaID } = formData;
    const data = { code: 200 };
    setTimeout(() => response.json(data), 1000);
});

// API /api/ideas/:ideaID - GET data for :ideaID idea (single)
router.get(`/:ideaID`, async (request, response) => {
    const { params: { ideaID }} = request;
    const ideaMockJSON = fs.readFileSync(`data-mock/idea-preview.json`);
    const ideaData = JSON.parse(ideaMockJSON);
    await response.json(ideaData);
});

module.exports = router;