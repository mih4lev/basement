const { Router } = require(`express`);
const router = new Router();
const fs = require(`fs`);
const multer = require('multer');
const albumUpload = multer({ dest: "./public/upload/albums/" });
const ideaUpload = multer({ dest: "./public/upload/ideas/" });

router.post(`/`, ideaUpload.array(`ideaPhotos`), async (request, response) => {
    const formData = { ...request.body, files: request.files};
    console.log(formData);
    const data = { code: 200, albumID: 10 };
    setTimeout(() => response.json(data), 1000);
});

router.delete(`/`, async (request, response) => {
    console.log(request.body);
    const { ideaID } = request.body;
    const data = { code: 200 };
    setTimeout(() => response.json(data), 1000);
});

router.get(`/:ideaID`, async (request, response) => {
    const { params: { ideaID }} = request;
    const mockJSON = fs.readFileSync(`data-mock/idea-preview.json`);
    const ideaData = JSON.parse(mockJSON);
    ideaData.id = ideaID;
    await response.json(ideaData);
});

router.post(`/albums`, albumUpload.single(`albumCover`), async (request, response) => {
    const formData = { ...request.body, file: request.file};
    console.log(formData);
    const data = { code: 200, albumID: 10 };
    setTimeout(() => response.json(data), 1000);
});

router.put(`/albums`, albumUpload.single(`albumCover`), async (request, response) => {
    const formData = { ...request.body, file: request.file};
    console.log(formData);
    const data = { code: 200 };
    setTimeout(() => response.json(data), 1000);
});

router.delete(`/albums`, async (request, response) => {
    console.log(request.body);
    const { albumID } = request.body;
    const data = {code: 200};
    setTimeout(() => response.json(data), 1000);
});

module.exports = router;