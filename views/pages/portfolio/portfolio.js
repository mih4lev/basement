const imageSize = [
    [`(max-width: 479px)`, `image/jpeg`, `_154x154.jpg`, `_308x308.jpg`],
    [`(min-width: 480px)`, `image/jpeg`, `_252x252.jpg`, `_504x504.jpg`]
];

export const portfolioData = (data) => {
    const { workLink, workCity, workImage, workSquare, workTitle } = data;
    const link = `/portfolio/` + workLink;
    const imageTitle = workTitle + `,` + workCity;
    return [
        { type: `link`, selector: `.portfolioButton`, link },
        {
            type: `picture`, parent: `.imageWrapper`, alt: imageTitle, image: workImage,
            imageSize, selector: `portfolioPhoto`, plug: [`portfolioPhoto`, `defaultImage`]
        },
        { type: `text`, selector: `.portfolioHeader`, text: workTitle },
        { type: `text`, selector: `.portfolioCity`, text: workCity },
        { type: `text`, selector: `.portfolioSquare`, text: workSquare }
    ];
};