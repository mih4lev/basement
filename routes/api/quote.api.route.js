const { Router } = require(`express`);
const router = new Router();
const multer = require('multer');
const formParser = multer();

// API /api/quote - POST - save quote data form
router.post(`/`, formParser.none(), async (request, response) => {
    const data = { code: 200 };
    setTimeout(() => response.json(data), 0);
});

module.exports = router;