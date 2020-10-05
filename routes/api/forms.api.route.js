const { Router } = require(`express`);
const router = new Router();
const multer = require('multer');
const formParser = multer();

const {
    checkRequestData, checkQuoteData
} = require("../../controllers/forms.controller");
const { saveRequest, saveQuote } = require("../../models/forms.model");

// API /api/forms/request - POST
router.post(`/request`, formParser.none(), async (request, response) => {
    const formData = checkRequestData(request.body);
    const data = await saveRequest(formData);
    setTimeout(() => response.json(data), 0);
});

// API /api/forms/quote - POST
router.post(`/quote`, formParser.none(), async (request, response) => {
    const formData = checkQuoteData(request.body);
    const data = await saveQuote(formData);
    setTimeout(() => response.json(data), 0);
});

module.exports = router;