const imageSize = [
    [`(max-width: 479px)`, `image/jpeg`, `_120x83.jpg`, `_240x166.jpg`],
    [`(max-width: 767px)`, `image/jpeg`, `_228x123.jpg`, `_456x246.jpg`],
    [`(max-width: 999px)`, `image/jpeg`, `_236x123.jpg`, `_472x246.jpg`],
    [`(max-width: 1439px)`, `image/jpeg`, `_314x173.jpg`, `_628x346.jpg`],
    [`(min-width: 1440px)`, `image/jpeg`, `_330x173.jpg`, `_660x346.jpg`]
];

export const pressData = (data) => {
    const {
        pressAnnounce, pressDate, pressMagazine, pressTitle, pressImage, pressLink
    } = data;
    const link = `/about-us/in-the-press/` + pressLink;
    return [
        { type: `link`, selector: `.cardLink`, link },
        { type: `link`, selector: `.cardHeader`, title: pressTitle, link },
        {
            type: `picture`, parent: `.cardLink`, alt: pressTitle, image: pressImage,
            imageSize, selector: `cardImage`, plug: [`cardImage`, `defaultImage`]
        },
        { type: `text`, selector: `.cardAnnounce`, text: pressAnnounce },
        { type: `text`, selector: `.dataDate`, text: pressDate },
        { type: `text`, selector: `.dataState`, text: pressMagazine }
    ];
};