const { Router } = require(`express`);
const router = new Router();
const multer = require('multer');
const formParser = multer();
const FS = require(`fs`);

// API /api/portfolio/filter - GET ELEMENTS with filter body
router.post(`/filter`, formParser.none(), async (request, response) => {
    const formData = { ...request.body };
    console.log(formData);
    const mockJSON = FS.readFileSync(`data-mock/portfolio.json`);
    const mockData = JSON.parse(mockJSON);
    const data = { code: 200, data: mockData.portfolio };
    setTimeout(() => response.json(data), 1000);
});


module.exports = router;