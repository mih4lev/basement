const { Router } = require(`express`);
const router = new Router();
const multer = require('multer');
const formDataParser = multer();
const avatarUpload = multer({ dest: "./public/upload/avatars/" });

router.post(`/settings`, avatarUpload.single(`avatarPhoto`), async (request, response) => {
    const formData = { ...request.body, file: request.file};
    console.log(formData);
    const data = { code: 200 };
    setTimeout(() => response.json(data), 1000);
});

router.post(`/ideas`, formDataParser.none(), async (request, response) => {
    const formData = { ...request.body };
    console.log(formData);
    const responseCode = (formData.ideaID) ? 200 : 403;
    const data = { code: responseCode };
    setTimeout(() => response.json(data), 1000);
});

module.exports = router;