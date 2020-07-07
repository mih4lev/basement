const { Router } = require(`express`);
const router = new Router();
const fs = require(`fs`);
const multer = require('multer');
const albumUpload = multer({ dest: "./public/upload/albums/" });
const formParser = multer();

// API /api/profile/albums GET
router.get(`/`, async (request, response) => {
    const albumsMockJSON = fs.readFileSync(`data-mock/ideas-albums.json`);
    const { albums } = await JSON.parse(albumsMockJSON);
    await response.json(albums);
});

// API /api/profile/albums POST
router.post(`/`, albumUpload.single(`albumCover`), async (request, response) => {
    const formData = { ...request.body, file: request.file };
    console.log(formData);
    const data = { code: 200, albumID: 10 };
    setTimeout(() => response.json(data), 1000);
});

// API /api/profile/albums PUT
router.put(`/`, albumUpload.single(`albumCover`), async (request, response) => {
    const formData = { ...request.body, file: request.file };
    console.log(formData);
    const data = { code: 200 };
    setTimeout(() => response.json(data), 1000);
});

// API /api/profile/albums DELETE
router.delete(`/`, formParser.none(), async (request, response) => {
    const formData = { ...request.body };
    console.log(formData);
    const data = { code: 200 };
    setTimeout(() => response.json(data), 1000);
});

module.exports = router;