const { Router } = require(`express`);
const router = new Router();
const fetch = require(`node-fetch`);

router.get(`/`, async (request, response) => {

    const JSON = await fetch(`https://www.instagram.com/basement_remodeling_com/?__a=1`);
    const {
        graphql: { user: { edge_owner_to_timeline_media: { edges: posts }}}
    } = await JSON.json();
    const filter = ({ node: { thumbnail_src, shortcode }}) => {
        return { thumb: thumbnail_src, link: `https://instagram.com/p/${shortcode}/` };
    };
    let instagramPosts = posts.map(filter);
    instagramPosts.length = 6;

    const body = {
        layout: `instagram`,
        instagramPosts
    };

    response.render('layouts/instagram', body);
});

module.exports = router;