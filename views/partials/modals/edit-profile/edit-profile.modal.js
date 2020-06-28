import { changeModalVisible, resetDropEvents, saveAction, setModal } from "../modals";

export const editProfileModal = () => {

    const modalNode = setModal(`edit-profile`);

    const formNode = modalNode.querySelector(`.formWrapper`);
    const dropZone = modalNode.querySelector(`.photoLabel`);
    const photoField = modalNode.querySelector(`.photoField`);
    const textFields = [...modalNode.querySelectorAll(`.fieldInput`)];
    const updateButton = modalNode.querySelector(`.submitButton`);

    // profile header fields
    const nameField = document.querySelector(`.userNameWrapper .name`);
    const surnameField = document.querySelector(`.userNameWrapper .surname`);
    const usernameField = document.querySelector(`.userNameWrapper .username`);
    const mailField = document.querySelector(`.userNameWrapper .mail`);
    const avatarWrapper = document.querySelector(`.cardSection .userAvatar`);
    let avatar = avatarWrapper.querySelector(`.avatarPicture`);

    // modal fields
    const modalNameField = modalNode.querySelector(`#firstName`);
    const modalSurnameField = modalNode.querySelector(`#lastName`);
    const modalUsernameField = modalNode.querySelector(`#userName`);
    const modalMailField = modalNode.querySelector(`#userMail`);
    const modalAvatarWrapper = modalNode.querySelector(`.avatarField`);
    let avatarNode = modalNode.querySelector(`.inputFieldPicture`);

    // edit button handler
    const editButtons = [...document.querySelectorAll(`.editProfileButton`)];
    editButtons.forEach((button) => {
        button.addEventListener(`click`, changeModalVisible(modalNode));
    })

    // create avatar node
    const createAvatarNode = (className, parentWrapper) => {
        const avatarNode = document.createElement(`img`);
        avatarNode.classList.add(className);
        avatarNode.setAttribute(`alt`, `User avatar`);
        parentWrapper.appendChild(avatarNode);
        return avatarNode;
    };

    // synchronize data from profile to modal
    const synchronizeData = ({ toModal = true }) => {
        const modalData = [ modalNameField, modalSurnameField, modalUsernameField, modalMailField ];
        const profileData = [ nameField, surnameField, usernameField, mailField ];
        modalData.forEach((data, index) => {
            if (toModal) modalData[index].value = profileData[index].innerText;
            else profileData[index].innerText = modalData[index].value;
        })
    };

    // check button status
    const checkButtonStatus = () => {
        const filter = (field) => !!field.value;
        const isFieldsValid = textFields.filter(filter).length === textFields.length;
        const isFilesValid = !!(avatarNode && avatarNode.src);
        updateButton.disabled = !isFieldsValid || !isFilesValid;
    };

    // set profile data to edit modal
    const setProfileData = () => {
        synchronizeData({ toModal: true });
        const avatarSource = (avatar) ? avatar.src : false;
        if (!avatarNode && avatarSource) {
            avatarNode = createAvatarNode(`inputFieldPicture`, modalAvatarWrapper);
        }
        if (avatarSource) avatarNode.src = avatarSource;
        checkButtonStatus();
    };

    // set profile data to default
    if (modalNode) setProfileData();

    // upload success handler
    const uploadSuccessHandler = (filename) => {
        return ({ target: { result: generatedURL }}) => {
            if (!avatarNode) {
                avatarNode = createAvatarNode(`inputFieldPicture`, modalAvatarWrapper);
            }
            avatarNode.src = generatedURL;
            avatarNode.setAttribute(`alt`, filename);
            checkButtonStatus();
        }
    };

    // upload error handler
    const uploadErrorHandler = (error) => {
        console.log(error);
    };

    // show upload files
    const showUploadFiles = () => {
        [...photoField.files].forEach((file) => {
            const reader = new FileReader();
            reader.addEventListener(`load`, uploadSuccessHandler(file.name))
            reader.addEventListener(`error`, uploadErrorHandler);
            reader.readAsDataURL(file);
        });
    };

    // update image by drag & drop && unload
    photoField.addEventListener(`change`, () => {
        if (!photoField.files || !photoField.files.length) return false;
        showUploadFiles();
    });

    // d&d actions | events
    const dropHandler = (event) => {
        if (!event.dataTransfer || !event.dataTransfer.files.length) return false;
        photoField.files = event.dataTransfer.files;
        showUploadFiles();
    };
    if (dropZone) resetDropEvents([ dropZone ]);
    if (dropZone) dropZone.addEventListener(`drop`, dropHandler);

    // check button status on text fields edit
    textFields.forEach((field) => {
        field.addEventListener(`input`, () => checkButtonStatus());
    });

    // update data from modal to profile
    const changeProfileData = () => {
        // change data on profile && hide modal
        synchronizeData({ toModal: false });
        // change avatar picture on profile from modal
        if (!avatar) avatar = createAvatarNode(`avatarPicture`, avatarWrapper);
        avatar.src = avatarNode.src;
    };

    // update data on form
    updateButton.addEventListener(`click`, async (event) => {
        event.preventDefault();
        // change button && fetch data
        const formData = new FormData(formNode);
        const responseOptions = { URL: `/api/profile/settings`, body: formData, button: updateButton };
        const responseData = await saveAction(responseOptions);
        if (responseData.code !== 200) return false; // need show error
        // change profile data
        changeProfileData();
        // hide edit modal
        changeModalVisible(modalNode)();
    });

};