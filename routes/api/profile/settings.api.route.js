const { Router } = require(`express`);
const router = new Router();
const multer = require('multer');
const uploadDir = `public/upload/users/`;
const imagesParser = multer({ dest: uploadDir });

const usersImages = [
    {
        name: `avatarImage`,
        maxCount: 1,
        sizes: [
            [32, 32, 80], [64, 64, 80],
            [76, 76, 80], [152, 152, 80],
            [86, 86, 80], [172, 172, 80],
            [130, 130, 80], [260, 260, 80]
        ],
        output: [`jpeg`, `webp`]
    }
];

const { saveImages } = require("../../../models/images.model");
const { updateUser } = require("../../../models/users.model");

// API /api/profile/settings/edit POST
router.post(`/edit`, imagesParser.fields(usersImages), async (request, response, next) => {
    if (!request.data['userID']) return next();
    const { body: { userID }} = request;
    const files = await saveImages(usersImages, request.files, userID);
    const formData = { ...request.body, ...files };
    const responseData = await updateUser(formData);
    setTimeout(() => response.json(responseData), 0);
});

module.exports = router;