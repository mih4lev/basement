const { Router } = require(`express`);
const router = new Router();
const multer = require('multer');
const formParser = multer();

// API /api/zip-code - POST | add ideas (multiple)
router.post(`/`, formParser.none(), async (request, response) => {
    const formData = { ...request.body };
    console.log(formData);
    const data = { code: 200 };
    setTimeout(() => response.json(data), 0);
});

module.exports = router;