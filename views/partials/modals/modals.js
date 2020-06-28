export const changeModalVisible = (modalNode) => {
    return () => {
        const isModalActive = modalNode.classList.contains(`activeModal`);
        const modalClassAction = (isModalActive) ? `remove` : `add`;
        modalNode.classList[modalClassAction](`activeModal`);
    }
};

export const setModal = (modalName) => {
    const modalNode = document.querySelector(`[data-modal="${modalName}"]`);
    const closeButton = modalNode.querySelector(`.closeButton`);
    closeButton.addEventListener(`click`, changeModalVisible(modalNode));
    return modalNode;
};

export const resetDropEvents = (elements) => {
    const dropEvents = [`dragenter`, `dragover`, `dragleave`, `drop`];
    const removeBrowserAPI = (eventName) => {
        return (event) => {
            event.preventDefault();
            const isHovered = (eventName === `dragenter` || eventName === `dragover`);
            const classAction = (isHovered) ? `add` : `remove`;
            event.target.classList[classAction](`dropOver`);
        }
    }
    dropEvents.forEach((eventName) => {
        elements.forEach((node) => {
            node.addEventListener(eventName, removeBrowserAPI(eventName));
        });
    });
};

export const setButtonStatus = ({ button, isLoaded }) => {
    const classAction = (isLoaded) ? `remove` : `add`;
    button.classList[classAction](`loadButton`);
    if (!isLoaded) button.setAttribute(`disabled`, `disabled`);
    else button.removeAttribute(`disabled`);
};

export const saveAction = async ({ URL, method = `POST`, isJSON = false, body, button }) => {
    setButtonStatus({ button: button, isLoaded: false });
    const JSONHeaders = { "Content-Type": "application/json" };
    const JSONOptions = { method, headers: JSONHeaders, body: JSON.stringify(body) };
    const formOptions = { method, body };
    const responseOptions = (isJSON) ? JSONOptions : formOptions;
    const response = await fetch(URL, responseOptions);
    const responseData = await response.json();
    setButtonStatus({ button: button, isLoaded: true });
    return responseData;
};