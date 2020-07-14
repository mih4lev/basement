const { Router } = require(`express`);
const router = new Router();
const multer = require('multer');
const formParser = multer();

// API /api/tips/filter - GET ELEMENTS with filter body
router.post(`/filter`, formParser.none(), async (request, response) => {
    const formData = { ...request.body };
    console.log(formData);
    const data = { code: 200 };
    setTimeout(() => response.json(data), 1000);
});


module.exports = router;