export const processSteps = () => {

    const processList = [...document.querySelectorAll(`.processList .processItem`)];
    processList.forEach((process, index) => {
        const processButton = process.querySelector(`.activeProcessButton`);
        if (!processButton) return false;
        processButton.addEventListener(`click`, () => {
            const nextProcess = process.nextElementSibling;
            nextProcess.classList.remove(`processHidden`);
            processButton.classList.replace(`activeProcessButton`, `processButton`);
        });
    });

};