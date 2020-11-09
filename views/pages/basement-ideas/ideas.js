const imageSize = [
    [`(max-width: 479px)`, `image/jpeg`, `_154x154.jpg`, `_308x308.jpg`],
    [`(min-width: 480px)`, `image/jpeg`, `_252x252.jpg`, `_504x504.jpg`]
];

export const ideasData = (data) => {
    const { ideaID, ideaImage, ideaTitle, ideaAuthor, isVisible, isLogin, editLink } = data;
    return [
        {
            type: `picture`, parent: `.imageWrapper`, alt: ideaTitle, image: ideaImage,
            imageSize, selector: `ideaPhoto`, data: `idea`, value: ideaID
        },
        { type: `editLink`, parent: `.imageWrapper`, selector: `adminEdit`, link: editLink },
        { type: `text`, selector: `.ideaTitle`, text: ideaTitle },
        { type: `text`, selector: `.ideaAuthor`, text: ideaAuthor },
        { type: `custom`, selector: `.saveIdea`, name: `idea`, value: ideaID, isVisible, isLogin }
    ];
};