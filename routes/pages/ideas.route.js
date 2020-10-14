const { Router } = require(`express`);
const router = new Router();

const { requestMeta, requestTextContent } = require("../../models/pages.model");
const { requestContent } = require("../../models/utils.model");
const {
    requestIdeas, requestIdeasCount, requestCategoryIdeasByURL
} = require("../../models/ideas.model");
const {
    requestMainCategories, requestSubCategories, requestCategory,
    requestSubCategory, requestChildCategory, requestCategoryURLData
} = require("../../models/categories.model");
const {
    requestIdeasFilters
} = require("../../models/filters.model");

router.use(async (request, response, next) => {
    request.data['isAdaptiveHeader'] = false;
    request.data['isBasementIdeas'] = true;
    request.data['scripts'] = [`ideas`];
    next();
});

router.get(`/:categoryTitle`, async (request, response) => {
    const { params: { categoryTitle }} = request;
    const userID = request.data['userID'];
    const pageID = 13;
    const ideasRequest = { categoryURL: categoryTitle, userID, limit: 12 };
    const content = requestContent(await Promise.all([
        requestMeta(pageID),
        requestTextContent(pageID),
        requestCategory(categoryTitle, true),
        requestSubCategories(categoryTitle, true),
        requestIdeasFilters(),
        requestCategoryIdeasByURL(ideasRequest),
        requestCategoryURLData(categoryTitle)
    ]));
    const data = { ...request.data, ...content };
    const template = `pages/basement-ideas/categories/main-categories`;
    response.render(template, data);
});

router.get(`/:categoryTitle/:subCategoryTitle`, async (request, response) => {
    const { params: { categoryTitle, subCategoryTitle }} = request;
    const userID = request.data['userID'];
    const pageID = 13;
    const ideasRequest = { categoryURL: subCategoryTitle, userID, limit: 12 };
    const content = requestContent(await Promise.all([
        requestMeta(pageID),
        requestTextContent(pageID),
        requestSubCategories(subCategoryTitle, true),
        requestCategory(categoryTitle, true),
        requestSubCategory(subCategoryTitle, true),
        requestIdeasFilters(),
        requestCategoryIdeasByURL(ideasRequest),
        requestCategoryURLData(subCategoryTitle)
    ]));
    const data = { ...request.data, ...content };
    const template = `pages/basement-ideas/categories/sub-categories`;
    response.render(template, data);
});

router.get(`/:categoryTitle/:subCategoryTitle/:childCategoryTitle`, async (request, response) => {
    const { params: { categoryTitle, subCategoryTitle, childCategoryTitle }} = request;
    const userID = request.data['userID'];
    const pageID = 13;
    const ideasRequest = { categoryURL: childCategoryTitle, userID, limit: 12 };
    const content = requestContent(await Promise.all([
        requestMeta(pageID),
        requestTextContent(pageID),
        requestSubCategories(subCategoryTitle, true, childCategoryTitle),
        requestCategory(categoryTitle, true),
        requestSubCategory(subCategoryTitle, true),
        requestChildCategory(childCategoryTitle, true),
        requestIdeasFilters(),
        requestCategoryIdeasByURL(ideasRequest),
        requestCategoryURLData(childCategoryTitle)
    ]));
    const data = { ...request.data, ...content };
    const template = `pages/basement-ideas/categories/child-categories`;
    response.render(template, data);
});

router.get(`/`, async (request, response) => {
    const userID = request.data['userID'];
    const pageID = 13;
    const ideasRequest = { limit: 12, userID };
    const content = requestContent(await Promise.all([
        requestMeta(pageID),
        requestTextContent(pageID),
        requestMainCategories(),
        requestIdeasFilters(),
        requestIdeas(ideasRequest),
        requestIdeasCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `pages/basement-ideas/basement-ideas`;
    response.render(template, data);
});

module.exports = router;