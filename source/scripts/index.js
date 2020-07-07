import { headerMenu } from "../../views/partials/header/header";
import { titleWidth, webpCheck } from "./utils";
import { showDeleteWrappers, showMoreIdeas } from "../../views/pages/profile/profile";
import { addPhotoModal } from "../../views/partials/modals/add-photo/add-photo.modal";
import { editProfileModal } from "../../views/partials/modals/edit-profile/edit-profile.modal";
import { editAlbumModal } from "../../views/partials/modals/edit-album/edit-album.modal";
import { createAlbumModal } from "../../views/partials/modals/create-album/create-album.modal";
import { viewIdeaModal } from "../../views/partials/modals/view-idea/view-idea.modal";
import { signInModal } from "../../views/partials/modals/sign-in/sign-in.modal";
import { contactUsModal } from "../../views/partials/modals/contact-us/contact-us.modal";
import { processSteps } from "../../views/pages/how-it-works/process/process";
import { signUpForm } from "../../views/pages/sign-up/sign-up";

// webp checker
webpCheck();

// header menu
headerMenu();

// how it works => our process | show steps
processSteps();

// ideas modal show
viewIdeaModal();

// login button modal show
signInModal();

// add contact us modal show
contactUsModal();

if (location.href.includes(`sign-up`)) {
    signUpForm();
}

// need worked only on profile page (made custom loading JS)
if (location.href.includes(`profile`)) { // temp
    addPhotoModal();
    showDeleteWrappers();
    showMoreIdeas();
    editProfileModal();
    createAlbumModal();
    editAlbumModal();
}

// temp func for title width
titleWidth();