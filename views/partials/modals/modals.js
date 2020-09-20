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