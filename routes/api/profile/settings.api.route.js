const { Router } = require(`express`);
const router = new Router();
const multer = require('multer');
const avatarUpload = multer({ dest: "public/upload/avatars/" });
const formParser = multer();

// CRUD API /api/profile/settings

// API /api/profile/settings POST (save data to BD with registration)
router.post(`/`, formParser.none(), async (request, response) => {
    const formData = { ...request.body };
    console.log(formData);
    const data = { code: 200 };
    setTimeout(() => response.json(data), 1000);
});

// API /api/profile/settings PUT (save data to BD with registration)
router.put(`/`, avatarUpload.single(`avatarPhoto`), async (request, response) => {
    const formData = { ...request.body, file: request.file};
    console.log(formData);
    const data = { code: 200 };
    setTimeout(() => response.json(data), 1000);
});

module.exports = router;