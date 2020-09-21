const imageSize = [
    [`(max-width: 479px)`, `image/jpeg`, `_120x83.jpg`, `_240x166.jpg`],
    [`(max-width: 767px)`, `image/jpeg`, `_228x123.jpg`, `_456x246.jpg`],
    [`(max-width: 999px)`, `image/jpeg`, `_236x123.jpg`, `_472x246.jpg`],
    [`(max-width: 1439px)`, `image/jpeg`, `_314x173.jpg`, `_628x346.jpg`],
    [`(min-width: 1440px)`, `image/jpeg`, `_330x173.jpg`, `_660x346.jpg`]
];

export const testimonialsData = (data) => {
    const {
        testimonialID, testimonialAuthor, testimonialAnnounce, testimonialDate,
        testimonialState, testimonialRating, testimonialImage
    } = data;
    const link = `/about-us/testimonials/` + testimonialID;
    const title = testimonialAuthor + `'s testimonial`;
    const dataTitle = `Stars: ${testimonialRating}`;
    return [
        { type: `link`, selector: `.cardLink`, link },
        { type: `link`, selector: `.cardHeader`, title: testimonialAuthor, link },
        {
            type: `picture`, parent: `.cardLink`, alt: title, image: testimonialImage,
            imageSize, selector: `cardImage`, plug: [`cardImage`, `defaultImage`]
        },
        { type: `text`, selector: `.cardAnnounce`, text: testimonialAnnounce },
        { type: `text`, selector: `.dataDate`, text: testimonialDate },
        { type: `text`, selector: `.dataState`, text: testimonialState },
        { type: `data`, selector: `.stars`, name: `rating`, value: testimonialRating, title: dataTitle }
    ];
};