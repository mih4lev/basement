const { Router } = require(`express`);
const router = new Router();
const FS = require(`fs`);

router.get(`/`, async (request, response) => {

    const instagramJSON = FS.readFileSync(`data-mock/instagram.json`);
    const instagramData = await JSON.parse(instagramJSON);

    // const {
    //     graphql: { user: { edge_owner_to_timeline_media: { edges: posts }}}
    // } = await JSON.parse(instagramJSON);
    // const filter = ({ node: { thumbnail_src, shortcode }}) => {
    //     return { thumb: thumbnail_src, link: `https://instagram.com/p/${shortcode}/` };
    // };
    // let instagramPosts = posts.map(filter);

    const body = {
        layout: `instagram`,
        instagramData
    };

    response.render('layouts/instagram', body);
});

module.exports = router;